import { Chart, registerables, Tooltip } from 'chart.js';
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { useCurrentYearStartAndEndDates } from "../hooks/userCurrentYearStartAndEndDates.jsx";
import { formatDateInLocal } from "../utils/formattedDate.js";
import { DataContext } from "../context/DataContext.jsx";
import { useContext, useState, useRef } from "react";
import { Button, ButtonGroup, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Spacer, Textarea } from "@nextui-org/react";
import { FaCheck, FaTrash, FaEdit } from "react-icons/fa";
import { FaTasks } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";

// Register chart.js modules
Chart.register(...registerables);

// Custom tooltip positioning to display tooltip at cursor position
Tooltip.positioners.custom = (_elements, eventPosition) => {
    return {
        x: eventPosition.x,
        y: eventPosition.y,
    };
};

// Plugin for drawing a vertical line indicating the current date
const todayLinePlugin = {
    id: 'todayLine',
    afterDraw: (chart) => {
        const ctx = chart.ctx;
        const today = new Date();

        const xScale = chart.scales.x;
        const todayPosition = xScale.getPixelForValue(today);

        if (todayPosition >= xScale.left && todayPosition <= xScale.right) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(todayPosition, chart.chartArea.top);
            ctx.lineTo(todayPosition, chart.chartArea.bottom);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)'; // Red line color
            ctx.stroke();
            ctx.restore();
        }
    }
};

const GanttChart = () => {
    // Access shared data and functions from DataContext
    const { data, statusFilter, removeEvent, updateEventStatus, updateEvent, timeUnit } = useContext(DataContext);
    const { startDate, endDate } = useCurrentYearStartAndEndDates();
    const chartRef = useRef(null);

    // State for managing context menu visibility and position
    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        targetEventId: null,
    });

    // State for modal visibility and event being edited
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editEvent, setEditEvent] = useState(null);

    // Handle right-click event to show context menu for specific event
    const handleRightClick = (event) => {
        event.preventDefault();

        if (chartRef.current) {
            const chart = chartRef.current;
            const elements = chart.getElementsAtEventForMode(event.nativeEvent, 'nearest', { intersect: true }, true);

            if (elements.length > 0) {
                const { datasetIndex, index } = elements[0];
                const targetEvent = data.datasets[datasetIndex].data[index];

                setContextMenu({
                    visible: true,
                    x: event.clientX,
                    y: event.clientY,
                    targetEventId: targetEvent.id,
                });
            }
        }
    };

    // Close the context menu
    const handleCloseContextMenu = () => {
        setContextMenu({ ...contextMenu, visible: false });
    };

    // Delete the selected event
    const handleDeleteEvent = () => {
        if (contextMenu.targetEventId != null) {
            removeEvent(contextMenu.targetEventId);
        }
        handleCloseContextMenu();
    };

    // Edit the selected event by opening a modal
    const handleEditEvent = () => {
        const targetEvent = data.datasets[0].data.find(event => event.id === contextMenu.targetEventId);
        setEditEvent(targetEvent);
        setIsModalOpen(true);
        handleCloseContextMenu();
    };

    // Close the modal
    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditEvent(null);
    };

    // Save changes to the event
    const handleSaveEvent = () => {
        if (editEvent) {
            updateEvent(editEvent.id, editEvent);
            handleModalClose();
        }
    };

    // Change the status of the selected event
    const handleChangeStatus = (newStatus) => {
        if (contextMenu.targetEventId != null) {
            updateEventStatus(contextMenu.targetEventId, newStatus);
        }
        handleCloseContextMenu();
    };

    // Color mappings for each status
    const statusColors = {
        todo: "rgba(54, 162, 235, 0.8)", // Blue
        "in progress": "rgba(255, 206, 86, 0.8)", // Yellow
        completed: "rgba(75, 192, 192, 0.8)", // Green
    };

    // Filter data based on the selected status filter
    const filteredData = {
        ...data,
        datasets: data.datasets.map((dataset) => ({
            ...dataset,
            data: statusFilter
                ? dataset.data.filter((event) => event.status === statusFilter)
                : dataset.data,
            backgroundColor: (statusFilter
                    ? dataset.data.filter((event) => event.status === statusFilter)
                    : dataset.data
            ).map((event) => statusColors[event.status]),
        })),
    };

    // Base configuration options for the chart
    const baseOptions = {
        indexAxis: "y",
        resizeDelay: 20,
        responsive: true,
        layout: {
            padding: {
                top: 30,
                right: 40,
                bottom: 40,
            },
        },
        scales: {
            x: {
                position: "top",
                type: "time",
                time: {
                    unit: timeUnit,
                },
                min: startDate,
                max: endDate,
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label(tooltipItem) {
                        return tooltipItem.label;
                    },
                    title(tooltipItems) {
                        const event = tooltipItems[0].raw.EventName;
                        const startDate = new Date(tooltipItems[0].raw.x[0]);
                        const endDate = new Date(tooltipItems[0].raw.x[1]);

                        return [
                            event,
                            `From: ${formatDateInLocal(startDate)} - To: ${formatDateInLocal(endDate)}`,
                            `Description: ${tooltipItems[0].raw.description || "No description"}`
                        ];
                    },
                },
                position: "custom",
            },
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            datalabels: {
                labels: {
                    index: {
                        color: "#1c1c1c",
                        backgroundColor: "rgba(255,255,255, 0.1)",
                        align: "right",
                        anchor: "start",
                        font: { size: 12, weight: 400, lineHeight: 1.7 },
                        formatter(value) {
                            const startDate = new Date(value.x[0]);
                            const endDate = new Date(value.x[1]);
                            return (
                                value.EventName +
                                "\n" +
                                formatDateInLocal(startDate) +
                                " - " +
                                formatDateInLocal(endDate)
                            );
                        },
                    },
                },
            },
        },
    };

    return (
        <div
            className="w-full h-full flex items-center justify-center"
            onContextMenu={handleRightClick}
        >
            {/* Render the Gantt chart with filtered data and custom plugins */}
            <Bar ref={chartRef} data={filteredData} options={baseOptions} plugins={[todayLinePlugin]} />

            {/* Display context menu on right-click for event actions */}
            {contextMenu.visible && (
                <div
                    style={{
                        position: "absolute",
                        top: contextMenu.y,
                        left: contextMenu.x,
                        zIndex: 1000,
                    }}
                    onMouseLeave={handleCloseContextMenu}
                >
                    <ButtonGroup>
                        <Button color="danger" size="sm" onClick={handleDeleteEvent}>
                            <FaTrash />
                        </Button>
                        <Button color="secondary" size="sm" onClick={handleEditEvent}>
                            <FaEdit className="text-white"/>
                        </Button>
                        <Button color="primary" size="sm" onClick={() => handleChangeStatus("todo")}>
                            <FaTasks />
                        </Button>
                        <Button color="warning" size="sm" onClick={() => handleChangeStatus("in progress")}>
                            <GrInProgress className="text-white" />
                        </Button>
                        <Button color="success" size="sm" onClick={() => handleChangeStatus("completed")}>
                            <FaCheck className="text-white" />
                        </Button>
                    </ButtonGroup>
                </div>
            )}

            {/* Modal for editing event details */}
            <Modal isOpen={isModalOpen} onClose={handleModalClose}>
                <ModalContent>
                    <ModalHeader>Edit Event</ModalHeader>
                    <ModalBody>
                        <Input
                            label="Event Name"
                            value={editEvent?.EventName || ""}
                            onChange={(e) =>
                                setEditEvent({ ...editEvent, EventName: e.target.value })
                            }
                        />
                        <Spacer y={0.5} />
                        <Input
                            label="Start Date"
                            type="date"
                            value={editEvent?.x[0] || ""}
                            onChange={(e) =>
                                setEditEvent({ ...editEvent, x: [e.target.value, editEvent.x[1]] })
                            }
                        />
                        <Spacer y={0.5} />
                        <Input
                            label="End Date"
                            type="date"
                            value={editEvent?.x[1] || ""}
                            onChange={(e) =>
                                setEditEvent({ ...editEvent, x: [editEvent.x[0], e.target.value] })
                            }
                        />
                        <Spacer y={0.5} />
                        <Textarea
                            label="Description"
                            placeholder="Enter description"
                            fullWidth
                            value={editEvent?.description || ""}
                            onChange={(e) =>
                                setEditEvent({ ...editEvent, description: e.target.value })
                            }
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={handleModalClose}>
                            Cancel
                        </Button>
                        <Button color="default" className="bg-gray-800 text-white" onClick={handleSaveEvent}>
                            Save Changes
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default GanttChart;
