// As a senior React developer, software architect, and JavaScript instructor with over a decade of experience building scalable web applications, I'll walk you through the entire code logic of this TaskManagerApp component in a comprehensive, step-by-step manner. We'll dissect it from top to bottom, explaining the purpose, flow, and reasoning behind each part. I'll use clear sections for readability, highlight key React concepts (like hooks, state management, and rendering), point out architectural decisions, and tie it back to how everything works together to create a functional Kanban-style task manager.
// This component is a self-contained React functional component that implements a simple task board with three columns (To Do, In Progress, Done). It supports adding tasks, moving them between columns, deleting them, and basic UI interactions like a modal for new tasks. It's built using React hooks for state management, Tailwind CSS classes for styling, and Lucide icons for visuals. No external libraries beyond React and Lucide are used, making it lightweight.
// I'll explain the code in logical chunks: imports, state initialization, functions, constants, and the JSX render tree. At each step, I'll describe what it does, why it's done this way, how data flows, and any React-specific insights or potential improvements.
// Step 1: Imports
// jsximport { useState } from 'react';
// import { X, ArrowLeft } from 'lucide-react';

// What this does: This pulls in React's useState hook (for managing local component state) and two icons (X for close/delete, ArrowLeft for back navigation) from the Lucide React icon library.
// Logic and purpose: React functional components rely on hooks like useState for state without classes. Lucide is a popular icon set that's lightweight and customizable. We're only importing what's needed to avoid bundle bloat—a good practice for performance.
// Why this way: Selective imports reduce file size. No other hooks (e.g., useEffect) are needed here since there's no side-effect logic like API calls or subscriptions.
// Data flow insight: Icons are just UI elements; they don't affect data. useState will be used extensively for reactive updates.
// Architectural note: As a tutor, I'd emphasize starting with minimal imports. If this app grows, consider lazy-loading icons or using a custom icon component for consistency.

// Step 2: Component Definition and Props
// jsxconst TaskManagerApp = ({ onBackToHome }) => {
//   // ... rest of the code
// };
// export default TaskManagerApp;

// What this does: Defines a functional component TaskManagerApp that accepts a single prop: onBackToHome, a callback function (likely passed from a parent component to navigate back to a "projects" view).
// Logic and purpose: This makes the component reusable and integrable into a larger app (e.g., as part of a dashboard). The arrow function syntax is modern and concise.
// Why this way: Functional components are preferred in modern React (post-Hooks era) over class components for simplicity and better tree-shaking in builds.
// Data flow insight: Props flow top-down (unidirectional data flow in React). onBackToHome is invoked on button click but doesn't affect internal state.
// Architectural note: Good separation of concerns—the component handles its own tasks but delegates navigation upward. If scaling, I'd suggest TypeScript for prop types (e.g., onBackToHome: () => void).

// Step 3: State Initialization with useState
// jsxconst [tasks, setTasks] = useState({
//   todo: [
//     { id: 1, text: 'Design new landing page', priority: 'high', createdAt: new Date() },
//     { id: 2, text: 'Review pull requests', priority: 'medium', createdAt: new Date() }
//   ],
//   inProgress: [
//     { id: 3, text: 'Build authentication system', priority: 'high', createdAt: new Date() }
//   ],
//   done: [
//     { id: 4, text: 'Setup project repository', priority: 'low', createdAt: new Date() }
//   ]
// });

// const [newTaskText, setNewTaskText] = useState('');
// const [newTaskColumn, setNewTaskColumn] = useState('todo');
// const [newTaskPriority, setNewTaskPriority] = useState('medium');
// const [showAddTask, setShowAddTask] = useState(false);

// What this does: Initializes five pieces of state using useState:
// tasks: An object with three arrays (one per column), each containing task objects with id, text, priority, and createdAt. This is the core data structure—pre-populated with sample tasks for demo purposes.
// newTaskText, newTaskColumn, newTaskPriority: Form fields for adding a new task (text description, target column, priority level).
// showAddTask: Boolean to toggle the add-task modal visibility.

// Logic and purpose: useState creates reactive state—any update via setters (e.g., setTasks) triggers a re-render. The tasks object uses column IDs as keys for easy access/manipulation. Initial values provide a starting point, simulating persisted data.
// Why this way: Grouping tasks by column in an object is efficient for Kanban boards (O(1) access via keys). Separate states for form fields follow the "single responsibility" principle—each hook manages one concern, making debugging easier. No useReducer is used since the state isn't complex enough (yet).
// Data flow insight: State is local and immutable in updates (we'll see spread operators ... in setters). Form states collect user input, then feed into addTask. tasks is read in rendering and mutated via functions like moveTask.
// React insight: As an instructor, I'd note that useState is lazy-initialized (runs only once). For production, persist tasks in localStorage or a backend to survive refreshes.
// Architectural note: Scalable for small apps, but for larger ones, lift state to a parent or use Context/Redux. createdAt is stored but unused—potential for future features like sorting by date.

// Step 4: Core Functions (Event Handlers and State Updaters)
// These are pure functions (no side effects beyond state updates) that handle user interactions.
// 4.1: moveTask
// jsxconst moveTask = (taskId, fromColumn, toColumn) => {
//   setTasks(prev => {
//     const task = prev[fromColumn].find(t => t.id === taskId);
//     const newFromColumn = prev[fromColumn].filter(t => t.id !== taskId);
//     const newToColumn = [...prev[toColumn], {...task, status: toColumn}];
    
//     return {
//       ...prev,
//       [fromColumn]: newFromColumn,
//       [toColumn]: newToColumn
//     };
//   });
// };

// What this does: Moves a task from one column to another by updating the tasks state immutably.
// Step-by-step logic:
// Receives taskId, source column (fromColumn), and target (toColumn).
// Uses setTasks with a callback updater (receives previous state prev to avoid stale closures).
// Finds the task in the source array using Array.find (linear search, fine for small lists).
// Creates a new source array by filtering out the task (immutable).
// Creates a new target array by spreading the existing one and appending a copy of the task (using {...task} for shallow copy), updating its status to match the new column.
// Returns a new tasks object spreading prev and overriding the two changed columns.

// Purpose: Enables task progression (e.g., To Do → In Progress).
// Why this way: Immutable updates prevent bugs in React's reconciliation. Dynamic keys ([fromColumn]) make it flexible for any columns.
// Data flow: Triggered by button clicks in JSX → updates tasks → re-renders columns.
// Insight: status is added but never used elsewhere (dead code). In a real app, use it for filtering or validation. Performance: O(n) per move, but n is small.

// 4.2: addTask
// jsxconst addTask = () => {
//   if (!newTaskText.trim()) return;
  
//   const newTask = {
//     id: Date.now(),
//     text: newTaskText,
//     priority: newTaskPriority,
//     status: newTaskColumn,
//     createdAt: new Date()
//   };
  
//   setTasks(prev => ({
//     ...prev,
//     [newTaskColumn]: [...prev[newTaskColumn], newTask]
//   }));

//   setNewTaskText('');
//   setShowAddTask(false);
// };

// What this does: Adds a new task to the selected column if the text isn't empty.
// Step-by-step logic:
// Early return if trimmed text is empty (basic validation).
// Creates a new task object with a timestamp-based ID, form values, and current date.
// Updates tasks by appending to the target column's array (immutable spread).
// Resets form text and hides modal.

// Purpose: Handles form submission from the modal.
// Why this way: Simple validation prevents empty tasks. Date.now() for ID is quick but not unique-proof (use UUID in prod).
// Data flow: Called on modal "Add Task" button → appends to tasks → clears form states → re-renders.
// Insight: No error handling (e.g., duplicate IDs). Good reset for UX.

// 4.3: deleteTask
// jsxconst deleteTask = (taskId, column) => {
//   setTasks(prev => ({
//     ...prev,
//     [column]: prev[column].filter(t => t.id !== taskId)
//   }));
// };

// What this does: Removes a task from a specific column.
// Step-by-step logic:
// Uses updater callback.
// Filters the column's array to exclude the matching ID.
// Returns updated tasks object.

// Purpose: Delete functionality via × button.
// Why this way: Efficient and immutable. No need to search other columns since column is provided.
// Data flow: Triggered by task card button → updates tasks → re-renders column.
// Insight: Assumes ID uniqueness (which it should be).

// Step 5: Constants
// jsxconst columns = [
//   { id: 'todo', title: 'To Do', color: 'bg-gray-100', icon: '📋' },
//   { id: 'inProgress', title: 'In Progress', color: 'bg-blue-100', icon: '⚡' },
//   { id: 'done', title: 'Done', color: 'bg-green-100', icon: '✅' }
// ];

// const priorityColors = {
//   high: 'bg-red-100 text-red-700 border-red-300',
//   medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
//   low: 'bg-green-100 text-green-700 border-green-300'
// };

// What this does: Defines static data for columns (metadata for rendering) and priority styles (Tailwind classes for badges).
// Logic and purpose: columns array drives the loop in JSX for dynamic column rendering. priorityColors maps priorities to visual styles.
// Why this way: Constants outside render prevent re-creation on re-renders. Array/object literals are easy to extend (e.g., add more columns).
// Data flow: Read-only; used in JSX for mapping and className interpolation.
// Architectural note: Extracting to separate files if app grows. Emojis as icons are fun but consider accessibility (screen readers).

// Step 6: The Return Statement (JSX Render Logic)
// This is the UI tree. React compiles JSX to React.createElement calls. Rendering is declarative—describe what UI should look like based on state.
// 6.1: Root Container and Header
// jsxreturn (
//   <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
//     <header className="bg-white shadow-sm sticky top-0 z-10">
//       <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//         <div className="flex items-center gap-4">
//           <button 
//             onClick={onBackToHome}
//             className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             <span className="hidden sm:inline">Back to Projects</span>
//           </button>
//           <h1 className="text-2xl font-bold text-gray-800">📝 Task Manager</h1>
//         </div>
//         <button
//           onClick={() => setShowAddTask(true)}
//           className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
//         >
//           + Add Task
//         </button>
//       </div>
//     </header>
//     // ... rest
//   </div>
// );

// What this does: Root div sets full-screen gradient background. Header is sticky (stays on top when scrolling) with back button, title, and add button.
// Logic: onClick handlers trigger prop callback or state toggle. Flexbox for layout, responsive hide/show for text.
// Why: Sticky header for UX in long lists. Tailwind for rapid styling.
// Data flow: Add button toggles showAddTask → conditional modal render.
// Insight: No key prop needed here (static elements).

// 6.2: Main Content (Columns Grid)
// jsx<div className="max-w-7xl mx-auto px-4 py-8">
//   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//     {columns.map(column => (
//       <div key={column.id} className="flex flex-col">
//         <div className={`${column.color} rounded-t-lg p-4 border-b-4 border-gray-300`}>
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-bold flex items-center gap-2">
//               <span>{column.icon}</span>
//               {column.title}
//             </h2>
//             <span className="bg-white px-2 py-1 rounded-full text-sm font-semibold">
//               {tasks[column.id].length}
//             </span>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-b-lg p-4 min-h-96 space-y-3">
//           {tasks[column.id].map(task => (
//             <div
//               key={task.id}
//               className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-move"
//             >
//               <div className="flex justify-between items-start mb-2">
//                 <p className="text-sm font-medium text-gray-800 flex-1">
//                   {task.text}
//                 </p>
//                 <button
//                   onClick={() => deleteTask(task.id, column.id)}
//                   className="text-gray-400 hover:text-red-600 ml-2"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
              
//               <div className="flex items-center justify-between mt-3">
//                 <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[task.priority]}`}>
//                   {task.priority}
//                 </span>
                
//                 <div className="flex gap-1">
//                   {column.id !== 'todo' && (
//                     <button
//                       onClick={() => moveTask(task.id, column.id, column.id === 'inProgress' ? 'todo' : 'inProgress')}
//                       className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
//                     >
//                       ←
//                     </button>
//                   )}
//                   {column.id !== 'done' && (
//                     <button
//                       onClick={() => moveTask(task.id, column.id, column.id === 'todo' ? 'inProgress' : 'done')}
//                       className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
//                     >
//                       →
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
          
//           {tasks[column.id].length === 0 && (
//             <div className="text-center py-12 text-gray-400">
//               <p>No tasks yet</p>
//             </div>
//           )}
//         </div>
//       </div>
//     ))}
//   </div>
// </div>

// What this does: Renders a responsive grid (1 col mobile, 3 desktop) of columns. Each column has a colored header (with icon, title, task count) and a list of task cards. If empty, shows placeholder.
// Step-by-step logic:
// columns.map loops over column definitions, using key={column.id} for React's diffing.
// Header uses dynamic className for color, displays count from tasks[column.id].length.
// Task list: tasks[column.id].map renders cards with key={task.id}.
// Each card: Flex layouts for text + delete, priority badge (dynamic classes from priorityColors), and conditional move buttons.
// Move buttons: Logic checks column to show only valid directions (e.g., no left from 'todo'). onClick calls moveTask with hardcoded targets (adjacent columns only).
// Empty state conditional.

// Purpose: Visualizes tasks, enables interactions.
// Why: Mapping for DRY code. Conditionals prevent invalid moves. cursor-move hints at drag potential (but no actual drag here).
// Data flow: State drives rendering—tasks changes → loop re-runs efficiently (keys help React optimize).
// Insight: Nested maps are fine for small data; for large, memoize with useMemo. Hover/transition for polish.

// 6.3: Add Task Modal
// jsx{showAddTask && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center p-4">
//     <div className="bg-white rounded-lg p-6 w-full max-w-md">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-xl font-bold">Add New Task</h3>
//         <button onClick={() => setShowAddTask(false)} className="p-1 hover:bg-gray-100 rounded">
//           <X className="w-5 h-5" />
//         </button>
//       </div>
      
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-2">Task Description</label>
//           <textarea
//             value={newTaskText}
//             onChange={(e) => setNewTaskText(e.target.value)}
//             placeholder="Enter task description..."
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
//             rows="3"
//           />
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium mb-2">Column</label>
//           <select
//             value={newTaskColumn}
//             onChange={(e) => setNewTaskColumn(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2"
//           >
//             <option value="todo">To Do</option>
//             <option value="inProgress">In Progress</option>
//             <option value="done">Done</option>
//           </select>
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium mb-2">Priority</label>
//           <select
//             value={newTaskPriority}
//             onChange={(e) => setNewTaskPriority(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2"
//           >
//             <option value="low">Low</option>
//             <option value="medium">Medium</option>
//             <option value="high">High</option>
//           </select>
//         </div>
        
//         <div className="flex gap-3">
//           <button
//             onClick={() => setShowAddTask(false)}
//             className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={addTask}
//             className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
//           >
//             Add Task
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// )}

// What this does: Conditionally renders a fixed overlay modal when showAddTask is true.
// Step-by-step logic:
// Overlay for backdrop (dim background, center content).
// Modal card with close button (toggles state).
// Form fields: Controlled inputs (value + onChange) bound to state.
// Selects for column/priority (hardcoded options match constants).
// Buttons: Cancel hides modal; Add calls addTask.

// Purpose: User input for new tasks.
// Why: Controlled components ensure React manages form state (predictable). Fixed positioning for modal UX.
// Data flow: onChange updates form states → addTask consumes them.
// Insight: No form library (e.g., Formik) needed for simplicity. Add focus trap for accessibility.

// Overall Architecture and Final Thoughts

// How it all ties together: State is the heart—updates trigger re-renders. Functions are handlers bridging UI events to state changes. JSX declaratively reflects state. Unidirectional flow: Props in → State internal → Render out.
// Strengths: Simple, readable, performant for small scale. Good use of immutability.
// Improvements (as architect): Add drag-and-drop (react-beautiful-dnd), persistence, error boundaries, tests (Jest + RTL). Refactor into sub-components for maintainability.
// As tutor: Practice by adding features like task editing or search. Understand re-renders with React DevTools.


// =================================  CODE STRUCTURE  ========================================
// (1) imports
// (2) Cfunct TaskManagerApp(pr){
// (2a) state([news]),4states
// (2b) Cfunct moveTask(pr){setTasks(=>,V.find,V.filter,V...,return{...,2[]})}
// (2c) Cfunct addTask{if(!.trim),return,V{4obj},call{...,[]:[...]}2calls}
// (2d) Cfunct deleteTask(pr){setTask(=>({...,[]:.filter})}
// (2e) V[id,title,color,icon]
// (2f) V{3obj}
// (2e) jsxreturn(
// (2ea) <d.><he.><d.><d.><but,oncl,.><i/><sp.></sp></but><h1.></h1></d><but,oncl,.></but></d></he>
// (2eb) <d.><d.>{.map(=>(<d,key,.><d.$.color><d.><h2.><sp>{.color}</sp>{.title}</h2><sp.>{.length}</sp></d></d>
// (2ebi)<d.>{tasks[.id].map((=><d,key,.><d.><p.>{.text}</p><but,oncl,.><i./></but></d><d.><sp.${.priority}>{.priority}</sp><d.>{.id!==&&(<but,oncl,.></but>)}{.id!==&&(<but,oncl,.></but>)}</d></d></d>))}{tasks[.i].length===&&(<d.><p></p></d>)}
// (2ebii) </d></d>))}</d></d>
// (2ec) {showAddTask&&(<d.><d.><d.><h3.><h3><but,oncl,.><i/></but></d><d.><d><lab.><lab><txtar,val,onch,place,.,rows/></d><2d><lab.></lab><sel,val,onch,.><3opt,val></opt></sel><2/d><d.><2but,oncl,.><2/but></d></d></d></d>)}
// (2f) </d>
// (2g) )} export default TaskManagerApp


import { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';

const TaskManagerApp = ({ onBackToHome }) => {
  const [tasks, setTasks] = useState({
    todo: [
      { id: 1, text: 'Design new landing page', priority: 'high', createdAt: new Date() },
      { id: 2, text: 'Review pull requests', priority: 'medium', createdAt: new Date() }
    ],
    inProgress: [
      { id: 3, text: 'Build authentication system', priority: 'high', createdAt: new Date() }
    ],
    done: [
      { id: 4, text: 'Setup project repository', priority: 'low', createdAt: new Date() }
    ]
  });

  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskColumn, setNewTaskColumn] = useState('todo');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [showAddTask, setShowAddTask] = useState(false);

  const moveTask = (taskId, fromColumn, toColumn) => {
    setTasks(prev => {
      const task = prev[fromColumn].find(t => t.id === taskId);
      const newFromColumn = prev[fromColumn].filter(t => t.id !== taskId);
      const newToColumn = [...prev[toColumn], {...task, status: toColumn}];
      
      return {
        ...prev,
        [fromColumn]: newFromColumn,
        [toColumn]: newToColumn
      };
    });
  };

  const addTask = () => {
    if (!newTaskText.trim()) return;
    
    const newTask = {
      id: Date.now(),
      text: newTaskText,
      priority: newTaskPriority,
      status: newTaskColumn,
      createdAt: new Date()
    };
    
    setTasks(prev => ({
      ...prev,
      [newTaskColumn]: [...prev[newTaskColumn], newTask]
    }));

    setNewTaskText('');
    setShowAddTask(false);
  };

  const deleteTask = (taskId, column) => {
    setTasks(prev => ({
      ...prev,
      [column]: prev[column].filter(t => t.id !== taskId)
    }));
  };

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100', icon: '📋' },
    { id: 'inProgress', title: 'In Progress', color: 'bg-blue-100', icon: '⚡' },
    { id: 'done', title: 'Done', color: 'bg-green-100', icon: '✅' }
  ];

  const priorityColors = {
    high: 'bg-red-100 text-red-700 border-red-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    low: 'bg-green-100 text-green-700 border-green-300'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBackToHome}
              className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Projects</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">📝 Task Manager</h1>
          </div>
          <button
            onClick={() => setShowAddTask(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            + Add Task
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(column => (
            <div key={column.id} className="flex flex-col">
              <div className={`${column.color} rounded-t-lg p-4 border-b-4 border-gray-300`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <span>{column.icon}</span>
                    {column.title}
                  </h2>
                  <span className="bg-white px-2 py-1 rounded-full text-sm font-semibold">
                    {tasks[column.id].length}
                  </span>
                </div>
              </div>
              
              <div className="bg-white rounded-b-lg p-4 min-h-96 space-y-3">
                {tasks[column.id].map(task => (
                  <div
                    key={task.id}
                    className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-move"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-medium text-gray-800 flex-1">
                        {task.text}
                      </p>
                      <button
                        onClick={() => deleteTask(task.id, column.id)}
                        className="text-gray-400 hover:text-red-600 ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                      
                      <div className="flex gap-1">
                        {column.id !== 'todo' && (
                          <button
                            onClick={() => moveTask(task.id, column.id, column.id === 'inProgress' ? 'todo' : 'inProgress')}
                            className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                          >
                            ←
                          </button>
                        )}
                        {column.id !== 'done' && (
                          <button
                            onClick={() => moveTask(task.id, column.id, column.id === 'todo' ? 'inProgress' : 'done')}
                            className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {tasks[column.id].length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <p>No tasks yet</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Task</h3>
              <button onClick={() => setShowAddTask(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Task Description</label>
                <textarea
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Enter task description..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Column</label>
                <select
                  value={newTaskColumn}
                  onChange={(e) => setNewTaskColumn(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="todo">To Do</option>
                  <option value="inProgress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddTask(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagerApp;