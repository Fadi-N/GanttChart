import { createContext, useEffect, useState } from "react";

// Create a context for managing and sharing data across components
export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    // Define colors for each status type
    const statusColors = {
        todo: "rgba(54, 162, 235, 0.8)",
        "in progress": "rgba(255, 206, 86, 0.8)",
        completed: "rgba(75, 192, 192, 0.8)",
    };

    // State for status filter and time unit selection
    const [statusFilter, setStatusFilter] = useState("");
    const [timeUnit, setTimeUnit] = useState("month");

    // Function to initialize data, either from local storage or with default values
    const initializeData = () => {
        const savedData = localStorage.getItem("projectData");
        return savedData ? JSON.parse(savedData) : {
            labels: [],
            datasets: [
                {
                    label: "as",
                    data: [
                        {
                            id: 1,
                            x: ["2024-01-05", "2024-02-13"],
                            y: "NAME 1",
                            EventName: "Overview",
                            status: "todo",
                            description: "Initial overview and project kickoff.",
                        },
                        {
                            id: 2,
                            x: ["2024-02-15", "2024-04-10"],
                            y: "NAME 2",
                            EventName: "Requirements",
                            status: "in progress",
                            description: "Gathering and finalizing project requirements.",
                        },
                        {
                            id: 3,
                            x: ["2024-04-30", "2024-12-30"],
                            y: "NAME 2",
                            EventName: "Development",
                            status: "completed",
                            description: "Development phase including code implementation and testing.",
                        },
                        {
                            id: 4,
                            x: ["2024-08-09", "2024-12-25"],
                            y: "NAME 4",
                            EventName: "Testing",
                            status: "todo",
                            description: "Comprehensive testing to ensure product quality.",
                        },
                        {
                            id: 5,
                            x: ["2024-04-09", "2024-06-25"],
                            y: "NAME 3",
                            EventName: "Cloud Configuration",
                            status: "in progress",
                            description: "Setting up cloud infrastructure and configurations.",
                        },
                        {
                            id: 6,
                            x: ["2024-08-09", "2024-12-25"],
                            y: "NAME 5",
                            EventName: "CI/CD",
                            status: "todo",
                            description: "Establishing CI/CD pipelines for automated deployments.",
                        },
                        {
                            id: 7,
                            x: ["2024-05-01", "2024-09-25"],
                            y: "NAME 6",
                            EventName: "Cloud Deployments",
                            status: "completed",
                            description: "Deployment of application to the cloud environment.",
                        },
                        {
                            id: 8,
                            x: ["2024-07-09", "2024-09-05"],
                            y: "NAME 7",
                            EventName: "Bug Fixing",
                            status: "in progress",
                            description: "Identifying and fixing bugs prior to final release.",
                        },
                        {
                            id: 9,
                            x: ["2024-09-09", "2024-12-25"],
                            y: "NAME 7",
                            EventName: "Release",
                            status: "todo",
                            description: "Final release and handover to client.",
                        },
                    ],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 1,
                    borderSkipped: false,
                    borderRadius: 15,
                    barPercentage: 0.9,
                },
            ],
        };
    };

    // State for project data
    const [data, setData] = useState(initializeData);

    // Function to set background colors based on event status
    const setColorsBasedOnStatus = () => {
        setData((prevData) => ({
            ...prevData,
            datasets: prevData.datasets.map((dataset) => ({
                ...dataset,
                backgroundColor: dataset.data.map((event) => statusColors[event.status]),
            })),
        }));
    };

    // Call `setColorsBasedOnStatus` once after initialization
    useState(setColorsBasedOnStatus);

    // Save data to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("projectData", JSON.stringify(data));
    }, [data]);

    // Function to update an event by id
    const updateEvent = (id, updatedEvent) => {
        setData((prevData) => ({
            ...prevData,
            datasets: [
                {
                    ...prevData.datasets[0],
                    data: prevData.datasets[0].data.map((event) =>
                        event.id === id ? { ...event, ...updatedEvent } : event
                    ),
                },
            ],
        }));
        setColorsBasedOnStatus(); // Update colors after data change
    };

    // Function to update event status by id
    const updateEventStatus = (id, newStatus) => {
        setData((prevData) => ({
            ...prevData,
            datasets: [
                {
                    ...prevData.datasets[0],
                    data: prevData.datasets[0].data.map((event) =>
                        event.id === id ? { ...event, status: newStatus } : event
                    ),
                },
            ],
        }));
        setColorsBasedOnStatus(); // Update colors after status change
    };

    // Function to remove an event by id
    const removeEvent = (id) => {
        setData((prevData) => ({
            ...prevData,
            datasets: [
                {
                    ...prevData.datasets[0],
                    data: prevData.datasets[0].data.filter((event) => event.id !== id),
                    backgroundColor: prevData.datasets[0].backgroundColor.filter(
                        (_, index) => prevData.datasets[0].data[index].id !== id
                    ),
                },
            ],
        }));
    };

    // Provide context to child components
    return (
        <DataContext.Provider value={{
            data,
            setData,
            removeEvent,
            updateEventStatus,
            updateEvent,
            statusFilter,
            setStatusFilter,
            timeUnit,
            setTimeUnit
        }}>
            {children}
        </DataContext.Provider>
    );
};
