import {useState, useContext} from "react";
import {
    Accordion,
    AccordionItem,
    Input,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Textarea,
    DateRangePicker, Modal, useDisclosure, ModalContent, ModalHeader, ModalBody, ModalFooter
} from "@nextui-org/react";
import {DataContext} from "../context/DataContext.jsx";
import Documentation from "./Documentation.jsx";

// Component for the toolbar, including event creation and filters
const Toolbar = () => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    // Destructure state and functions from DataContext for managing global data
    const {setData, setStatusFilter, statusFilter, setTimeUnit} = useContext(DataContext);

    // Local state variables for form inputs
    const [assigneeName, setAssigneeName] = useState("");
    const [taskName, setTaskName] = useState("");
    const [dateRange, setDateRange] = useState({startDate: "", endDate: ""});
    const [status, setStatus] = useState("todo");
    const [description, setDescription] = useState("");

    // Function to handle adding a new event to the dataset
    const handleAddEvent = () => {
        const {startDate, endDate} = dateRange;

        // Check if all required fields are filled out
        if (assigneeName && taskName && startDate && endDate) {
            setData((prevData) => {
                const newEvent = {
                    id: Date.now(), // Generate a unique ID
                    x: [startDate, endDate], // Set the date range
                    y: assigneeName, // Set assignee as 'y'
                    EventName: taskName, // Set task name as EventName
                    status: status,
                    description: description // Add description to the task
                };

                return {
                    ...prevData,
                    datasets: [
                        {
                            ...prevData.datasets[0],
                            data: [...prevData.datasets[0].data, newEvent],
                        },
                    ],
                };
            });

            // Clear form fields after adding the task
            setAssigneeName("");
            setTaskName("");
            setDateRange({startDate: "", endDate: ""});
            setStatus("todo");
            setDescription(""); // Clear description field
        } else {
            alert("Please fill out all fields");
        }
    };

    // Helper function to format date for display
    const formatDate = (date) => {
        return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    };

    return (
        <aside className="w-1/5 bg-white shadow-lg p-6 hidden md:flex md:flex-col md:justify-between">
            <div className="md:flex md:flex-col space-y-3">
                <h1 className="text-2xl">Timeline</h1>
                <hr/>
                <Accordion selectionMode="multiple">
                    {/* Section for adding a new event */}
                    <AccordionItem key="1" aria-label="Add New Event" title="Add New Event">
                        <div className="flex flex-col space-y-2 pb-6">
                            <Input
                                clearable
                                label="Task Name"
                                placeholder="Enter task name"
                                fullWidth
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                            />
                            <Textarea
                                label="Description"
                                placeholder="Enter task description"
                                fullWidth
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <Input
                                clearable
                                label="Assignee"
                                placeholder="Enter assignee name"
                                fullWidth
                                value={assigneeName}
                                onChange={(e) => setAssigneeName(e.target.value)}
                            />
                            <DateRangePicker
                                label="Date Range"
                                onChange={(range) => setDateRange({
                                    startDate: formatDate(range.start),
                                    endDate: formatDate(range.end)
                                })}
                            />
                            <div className="flex items-center justify-between">
                                <label>Status</label>
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button color="default">
                                            {status ? status : "Select Status"}
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        className="w-full"
                                        aria-label="Select status for new event"
                                        onAction={(key) => setStatus(key)}
                                    >
                                        <DropdownItem key="todo">Todo</DropdownItem>
                                        <DropdownItem key="in progress">In Progress</DropdownItem>
                                        <DropdownItem key="completed">Completed</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                            <Button
                                onClick={handleAddEvent}
                                color="default"
                                className="bg-gray-800 text-white"
                                fullWidth
                            >
                                Add Event
                            </Button>
                        </div>
                    </AccordionItem>
                    {/* Section for applying filters */}
                    <AccordionItem key="2" aria-label="Filters" title="Filters">
                        <div className="flex items-center justify-between mb-4">
                            <label>Status</label>
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        color="default"
                                        className="bg-gray-800 text-white"
                                        size="sm"
                                    >
                                        {statusFilter ? statusFilter : "Select Status"}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    className="w-full"
                                    aria-label="Filter by status"
                                    onAction={(key) => setStatusFilter(key)}
                                >
                                    <DropdownItem key="todo">Todo</DropdownItem>
                                    <DropdownItem key="in progress">In Progress</DropdownItem>
                                    <DropdownItem key="completed">Completed</DropdownItem>
                                    <DropdownItem key="">All</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <hr className="mb-4"/>
                        <div className="flex items-center justify-between">
                            <label>Time unit</label>
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        color="default"
                                        className="bg-gray-800 text-white"
                                        size="sm"
                                    >
                                        Select Time Unit
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Select time unit"
                                    onAction={(key) => setTimeUnit(key)}
                                >
                                    <DropdownItem key="week">Weekly</DropdownItem>
                                    <DropdownItem key="month">Monthly</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </AccordionItem>
                </Accordion>
            </div>
            <Button
                onPress={onOpen}
                color="default"
                className="bg-gray-800 text-white"
            >
                Documentation
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full" scrollBehavior="inside">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Documentation</ModalHeader>
                            <ModalBody>
                                <Documentation/>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </aside>
    );
};

export default Toolbar;
