import { Accordion, AccordionItem, Spacer } from "@nextui-org/react";

const Documentation = () => {
    return (
        <div className="max-w-4xl mx-auto p-8 bg-gray-50 rounded-md shadow-md">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-6">GanttChart Component Documentation</h1>

            <p className="text-lg text-gray-700 mb-8">
                The <strong>GanttChart</strong> component is a robust implementation of a Gantt-style chart, built with <code>react-chartjs-2</code> and <code>chart.js</code>.
                It offers an intuitive way for users to manage project timelines by adding, editing, deleting, filtering, and changing the status of events. This component is ideal for
                visualizing project phases and task progression, supporting streamlined project management.
            </p>

            <Accordion className="space-y-4">
                {/* Overview Section */}
                <AccordionItem key="1" title="Features Overview">
                    <p className="text-gray-700 mb-4">
                        The <strong>GanttChart</strong> component offers the following functionalities to effectively manage tasks and visualize project timelines:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Add New Event:</strong> Enables the creation of events with key details, such as name, assignee, date range, status, and description.</li>
                        <li><strong>Edit Event:</strong> Allows modification of existing events through a modal form for updating event details.</li>
                        <li><strong>Delete Event:</strong> Provides the ability to remove events directly from the chart, ensuring the chart reflects only relevant tasks.</li>
                        <li><strong>Change Event Status:</strong> Easily update the status of events to 'todo', 'in progress', or 'completed' with color-coded status indicators.</li>
                        <li><strong>Filter Events by Status:</strong> Filter displayed events based on their current status to focus on specific stages of the project.</li>
                    </ul>
                </AccordionItem>

                {/* Adding Event Section */}
                <AccordionItem key="2" title="1. Adding a New Event">
                    <p className="text-gray-700 mb-4">
                        Users can add new events using the <strong>Toolbar</strong> component, which includes form fields for creating a task with the necessary details. This enables project managers to document every task in a single view.
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li><strong>Task Name:</strong> Specifies the title or name of the event or task.</li>
                        <li><strong>Assignee Name:</strong> Indicates the team member responsible for the task.</li>
                        <li><strong>Date Range (Start and End Date):</strong> Defines the timeframe for the task, essential for aligning with the project schedule.</li>
                        <li><strong>Status:</strong> Sets the task status as either 'todo', 'in progress', or 'completed'.</li>
                        <li><strong>Description:</strong> Provides a field for detailed notes about the task's requirements or specifics.</li>
                    </ul>
                    <p className="text-gray-700">
                        The <code>handleAddEvent</code> function validates the input fields, and upon successful validation, it adds the new event to the global <code>DataContext</code> state.
                        This function ensures that all new events contain complete information, maintaining the integrity of the data within the chart.
                    </p>
                </AccordionItem>

                {/* Editing Event Section */}
                <AccordionItem key="3" title="2. Editing an Existing Event">
                    <p className="text-gray-700 mb-4">
                        To modify an event, users can right-click on the event within the chart and select "Edit". This action opens a modal window, where users can adjust the task’s details such as the event name, start and end dates, and the description. This functionality is useful for real-time updates as project scopes change.
                    </p>
                    <p className="text-gray-700 font-semibold mb-2">Key Components Involved:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li><strong>Modal Form:</strong> A form displayed in a modal overlay, providing input fields for all editable event properties.</li>
                        <li><strong>handleSaveEvent:</strong> A function that saves the updated event information back to the global state in <code>DataContext</code>. This ensures all edits are persistent across sessions.</li>
                    </ul>
                    <p className="text-gray-700">
                        This feature ensures that project timelines are always up-to-date, allowing for immediate adjustments in response to changes or task updates.
                    </p>
                </AccordionItem>

                {/* Deleting Event Section */}
                <AccordionItem key="4" title="3. Deleting an Event">
                    <p className="text-gray-700">
                        Right-clicking on an event provides an option to delete it. Selecting this action triggers the <code>handleDeleteEvent</code> function, which removes the specified event from the <code>DataContext</code>.
                        This feature helps keep the Gantt chart clean and relevant by allowing users to remove outdated or canceled tasks.
                    </p>
                </AccordionItem>

                {/* Changing Event Status */}
                <AccordionItem key="5" title="4. Changing Event Status">
                    <p className="text-gray-700 mb-4">
                        The Gantt chart allows users to quickly change an event's status by right-clicking on it and selecting a new status from the context menu. The available statuses are 'todo', 'in progress', and 'completed'.
                        The <code>handleChangeStatus</code> function updates the status and applies color coding for easy visual identification:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>todo:</strong> Blue color to indicate tasks that are pending.</li>
                        <li><strong>in progress:</strong> Yellow color representing ongoing tasks.</li>
                        <li><strong>completed:</strong> Green color to denote tasks that have been finished.</li>
                    </ul>
                    <p className="text-gray-700">
                        This feature provides a visual way to track task progression and quickly identify which tasks need attention or follow-up.
                    </p>
                </AccordionItem>

                {/* Filtering Events */}
                <AccordionItem key="6" title="5. Filtering Events by Status">
                    <p className="text-gray-700">
                        The toolbar includes a filter option to display events based on their status. When a status is selected, it updates the <code>statusFilter</code> in the global state, limiting the displayed events to those that match the selected status.
                    </p>
                    <p className="text-gray-700">
                        This feature allows users to focus on specific segments of the project timeline, such as identifying tasks that are still pending or assessing the progress of tasks in progress.
                    </p>
                </AccordionItem>

                {/* UI Components Section */}
                <AccordionItem key="7" title="UI Components and Plugins">
                    <p className="text-gray-700 mb-2">
                        <strong>Context Menu:</strong> A right-click context menu provides quick options for each event, including delete, edit, and status update, allowing for efficient in-chart management.
                    </p>
                    <Spacer y={0.5} />
                    <p className="text-gray-700">
                        <strong>Today Line Plugin:</strong> A custom plugin that adds a red vertical line representing the current date. This line helps users visually align tasks with the current day, making it easier to track how close tasks are to their deadline or completion.
                    </p>
                </AccordionItem>

                {/* Chart Configuration Section */}
                <AccordionItem key="8" title="Chart Configuration">
                    <p className="text-gray-700 mb-2">
                        The GanttChart component is configured to display data dynamically based on the project timeline, offering customizable time scales and filters:
                    </p>
                    <p className="text-gray-700">
                        <strong>X-axis:</strong> Configured as a time scale that adjusts dynamically to show months or weeks based on the <code>timeUnit</code> selected. This flexibility allows the chart to display either broad overviews or detailed week-by-week progress.
                    </p>
                    <p className="text-gray-700">
                        <strong>Tooltip:</strong> Custom tooltips show comprehensive details about each event, including name, date range, and description, providing relevant context at a glance.
                    </p>
                    <p className="text-gray-700">
                        <strong>Data Filtering:</strong> Applies the <code>statusFilter</code> in real-time to control the visibility of events, making it easy to view only relevant tasks.
                    </p>
                </AccordionItem>

                {/* Screenshots */}
                <AccordionItem key="9" title="Screenshots">

                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default Documentation;
