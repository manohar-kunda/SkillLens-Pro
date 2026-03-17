const mysql = require('mysql2/promise');

const dbData = {
  react: {
    easy: [
      ['What is React primarily used for?', 'Database management', 'Building user interfaces', 'Server-side routing', 'OS development', 'B'],
      ['Which company developed and maintains React?', 'Google', 'Microsoft', 'Facebook (Meta)', 'Apple', 'C'],
      ['What is JSX?', 'A syntax extension for JavaScript', 'A database format', 'A CSS preprocessor', 'A test runner', 'A'],
      ['Which of the following is used to pass data to a component?', 'setState', 'render', 'PropTypes', 'Props', 'D'],
      ['How do you create a functional React component?', 'function MyComponent() {...}', 'new React()', 'React.createComponent()', 'create-react-component', 'A'],
      ['What is the Virtual DOM?', 'A direct copy of the real DOM', 'A lightweight JavaScript representation of the DOM', 'A browser API', 'A new HTML standard', 'B'],
      ['Which hook is used to manage local state?', 'useEffect', 'useContext', 'useState', 'useReducer', 'C'],
      ['What is a state in React?', 'An external database', 'A persistent storage', 'An internal data store for a component', 'A global variable', 'C'],
      ['What is the standard tool to bootstrap a React app?', 'webpack', 'create-react-app (or Vite)', 'react-init', 'react-build', 'B'],
      ['Can React be used for mobile development?', 'Yes, via React Native', 'No, it is strictly for DOM', 'Only on iOS', 'Only on Android', 'A'],
      ['Which method is used to render React to the DOM in React 18?', 'ReactDOM.render()', 'React.mount()', 'ReactDOM.createRoot().render()', 'window.render()', 'C'],
      ['What do you use to map an array to elements?', 'Array.map()', 'Array.forEach()', 'for loop', 'Array.reduce()', 'A'],
      ['What must you include when rendering a list of elements?', 'A unique key prop', 'An ID attribute', 'A class name', 'A ref', 'A'],
      ['What is the purpose of useEffect?', 'To handle side effects in functional components', 'To manage state', 'To replace context', 'To style components', 'A'],
      ['Which is NOT a rule of Hooks?', 'Only call Hooks at the top level', 'Call Hooks from React functions', 'Hooks can be called in loops', 'Custom hooks start with use', 'C'],
      ['How do you handle events in React?', 'onclick="myFunc()"', 'onClick={myFunc}', 'on-click="myFunc"', 'click={myFunc}', 'B'],
      ['What is a controlled component?', 'A component controlled by Redux', 'A component that renders its own state', 'A form element whose value is controlled by React', 'A component with error boundaries', 'C'],
      ['How do you conditionally render an element?', 'Using if/else inside JSX', 'Using the ternary operator or logical &&', 'Using the renderIf prop', 'Using show={true}', 'B'],
      ['What does the Fragment (<></>) component do?', 'Creates a new DOM node', 'Groups multiple elements without adding an extra DOM node', 'Handles routing', 'Applies styles', 'B'],
      ['How do you access the DOM directly in React?', 'document.getElementById', 'useDOM()', 'useRef()', 'useId()', 'C'],
      ['What is React Router used for?', 'Routing network requests', 'Server-side routing', 'Navigation in single-page applications', 'State management', 'C'],
      ['What is the children prop?', 'An array of child components', 'A reserved prop used to pass elements directly into their output', 'A method to clone elements', 'A database reference', 'B'],
      ['Why should you avoid mutating state directly?', 'It crashes the browser', 'React will not trigger a re-render', 'It is a syntax error', 'It deletes the state', 'B'],
      ['What is the purpose of Context API?', 'To pass props explicitly through every level', 'To share state globally without prop drilling', 'To replace the database', 'To compile JSX', 'B'],
      ['Which lifecycle method is equivalent to useEffect with an empty dependency array?', 'componentDidUpdate', 'componentWillUnmount', 'componentDidMount', 'render', 'C']
    ],
    medium: [
      ['What does React.memo do?', 'Memoizes the result of a function', 'Prevents a component from re-rendering if its props have not changed', 'Caches API HTTP requests', 'Stores global variables', 'B'],
      ['How does useEffect cleanup work?', 'By returning a function from the effect callback', 'By calling cleanup()', 'React does it automatically', 'By passing a generic cleanup string', 'A'],
      ['What is the difference between useMemo and useCallback?', 'None, they are identical', 'useMemo memoizes a value, useCallback memoizes a function', 'useMemo is for arrays, useCallback is for objects', 'useCallback is deprecated', 'B'],
      ['How does the Context API affect component re-renders?', 'It prevents all re-renders', 'Components consuming the context re-render whenever the context value changes', 'It has no effect on rendering', 'Only the provider re-renders', 'B'],
      ['What is prop drilling?', 'A library for data insertion', 'Passing data through many nested components that don’t need it', 'Drilling into the DOM', 'A performance optimization', 'B'],
      ['What is a custom hook?', 'A hook provided by React', 'A class method', 'A JavaScript function whose name starts with "use" and calls other hooks', 'A third-party Redux store', 'C'],
      ['Which hook would you use to read a context?', 'useProvider', 'useConsume', 'useContext', 'useState', 'C'],
      ['What is React.StrictMode?', 'A tool that prevents you from using JavaScript', 'A wrapper to highlight potential problems in an application', 'A production performance booster', 'A new rendering engine', 'B'],
      ['How do error boundaries catch errors?', 'Via try/catch in functional components', 'Using the componentDidCatch lifecycle method in class components', 'Using window.onerror', 'Using useEffect', 'B'],
      ['What is hydration in React?', 'Fetching data from an API', 'Attaching event listeners to server-rendered HTML markup', 'Minifying JavaScript', 'Applying CSS styles', 'B'],
      ['What happens if you pass an empty array to useEffect?', 'It runs on every render', 'It generates a syntax error', 'It runs only once after the initial render', 'It never runs', 'C'],
      ['What is a Higher-Order Component (HOC)?', 'A component at the top of the tree', 'A function that takes a component and returns a new component', 'A state management pattern', 'A built-in React hook', 'B'],
      ['How can you trigger a re-render manually if state doesn\'t change?', 'You shouldn\'t, but forceUpdate in classes or a dummy state toggle', 'Call React.render()', 'Call window.reload()', 'Changing a ref', 'A'],
      ['What does useReducer do?', 'Reduces the size of the JavaScript bundle', 'A state management hook similar to Redux for complex state logic', 'Iterates over arrays', 'Creates a context provider', 'B'],
      ['What is the role of the dependency array in useEffect?', 'It defines what modules to import', 'It tells React to run the effect only if those dependencies change', 'It dictates prop types', 'It is purely for documentation', 'B'],
      ['Can you use hooks inside conditionally executed blocks (if statements)?', 'Yes, always', 'Only if using StrictMode', 'No, it breaks the component call order', 'Yes, but only useState', 'C'],
      ['When is the cleanup function of useEffect called?', 'Just before the component is unmounted and before the next execution of the effect', 'After every re-render', 'Only on unmount', 'Before the initial render', 'A'],
      ['What does React.lazy do?', 'Delays the execution of an effect', 'Enables dynamic importing of components for code splitting', 'Memoizes components', 'Creates a web worker', 'B'],
      ['What is Suspense in React?', 'A component that lets you declaratively "wait" for something (like data or code)', 'A hook to pause animations', 'A method to stop event propagation', 'A routing technique', 'A'],
      ['How do you forward a ref to a child component?', 'Pass it as a normal prop called "ref"', 'Use React.forwardRef', 'Refs are automatically passed down', 'Use useContext', 'B'],
      ['What is the best way to copy an array in React state?', 'Using the assignment operator (=)', 'Using array.push()', 'Using the spread operator [...array]', 'Using array.concat() directly on state', 'C'],
      ['What is a portal in React?', 'A way to route to a new webpage', 'A way to render children into a DOM node outside the parent hierarchy', 'A secure API channel', 'A database connection', 'B'],
      ['What is concurrent mode?', 'A feature allowing React to interrupt a long render to handle high-priority events', 'Executing multiple JavaScript threads', 'Running Node and React together', 'Simultaneous network requests', 'A'],
      ['How do you handle API calls in a functional React component?', 'Inside the render block', 'Inside useEffect', 'In the index.js root', 'Inside a ref', 'B'],
      ['What will changing a ref using useRef() do?', 'Trigger a component re-render', 'Update a DOM element but NOT trigger a component re-render', 'Throw a warning', 'Update the database', 'B']
    ],
    hard: [
      ['Explain the reconciliation process in React.', 'React randomly replaces the DOM', 'React compares the Virtual DOM with a snapshot of the previous Virtual DOM, computing a diff to batch update the Real DOM selectively', 'React uses WebSockets to update the UI', 'React parses the HTML string and overwrites document.body', 'B'],
      ['What is the Fiber architecture?', 'A CSS styling method', 'A complete rewrite of Reacts core algorithm aimed at incremental rendering', 'A network layer in React Native', 'A third-party routing plugin', 'B'],
      ['What are synthetic events in React?', 'Fake data generators', 'Cross-browser wrappers around the browsers native event', 'Events triggered by the server', 'Events strictly for unit testing', 'B'],
      ['What is useLayoutEffect?', 'A hook identical to useEffect but runs synchronously after all DOM mutations', 'A hook to manage CSS grids', 'A hook for responsive design media queries', 'An outdated version of useEffect', 'A'],
      ['How do you implement Server-Side Rendering (SSR) securely in modern React?', 'React.renderToString() or React.renderToPipeableStream() alongside a framework like Next.js', 'By copying the React folder to Apache', 'By using express.static', 'React cannot be rendered on the server', 'A'],
      ['What is React Server Components (RSC)?', 'Components that fetch data directly on the server without sending JS to the client', 'A database library', 'A way to run Apache with React', 'A testing framework', 'A'],
      ['What is a pure component?', 'A component with zero CSS', 'A component that implements shouldComponentUpdate with a shallow prop/state comparison', 'A component with no state', 'A generic JS function', 'B'],
      ['Why might a React list render inefficiently even with keys?', 'Because the keys are the array iteration index (0,1,2...) and the list order changes', 'Because the keys are unique strings', 'Because keys are too long', 'Keys don\'t affect performance', 'A'],
      ['What is the concept of "Lifting State Up"?', 'Moving state to the cloud', 'Moving state to a common ancestor to share it between sibling components', 'Using Redux instead of local state', 'Animating the state values', 'B'],
      ['What is an abstract batching update?', 'Updating multiple states at once to trigger only a single re-render', 'Executing SQL queries in batches', 'A method to compress JS files', 'Downloading data in chunks', 'A'],
      ['What hook replaces getDerivedStateFromProps in functional components?', 'There is no exact hook; you compute the value directly during render or use useState + useEffect depending on the case', 'useDerivedState', 'useMemo', 'useContext', 'A'],
      ['How does Redux differ from the Context API?', 'There is no difference', 'Redux provides centralized state management with time-travel debugging and middleware; Context is best for simple dependency injection to avoid prop drilling', 'Redux is for backend, Context is frontend', 'Redux is deprecated', 'B'],
      ['Can useMemo be guaranteed to never recalculate until dependencies change?', 'Yes, absolutely', 'No, React may choose to "forget" some previously memoized values to free memory for offscreen components', 'Depending on the browser', 'Only in StrictMode', 'B'],
      ['What is a common pitfall of relying on Stale Closures inside useEffect?', 'It causes memory leaks', 'The effect captures variables from the render in which it was defined, leading to referring to outdated state', 'It triggers infinite loops', 'It prevents compilation', 'B'],
      ['How do you solve a stale closure in a setInterval inside useEffect?', 'Use useRef to store the latest callback, or add the dependency to the array', 'Use setTimeout instead', 'Restart the server', 'It cannot be solved', 'A'],
      ['What is the purpose of startTransition?', 'To trigger animations', 'To mark state updates as non-urgent so they don\'t block UI interactions', 'To redirect URLs', 'To boot the app', 'B'],
      ['What does useImperativeHandle do?', 'Forces a child to re-render', 'Customizes the instance value that is exposed to parent components when using ref', 'Handles global errors', 'Manages unhandled promises', 'B'],
      ['What is the difference between React.cloneElement and React.createElement?', 'cloneElement modifies an existing element and merges props, createElement builds a brand new element', 'They are exact aliases', 'createElement is deprecated', 'cloneElement copies the database', 'A'],
      ['What does useDeferredValue do?', 'Pauses the Javascript runtime', 'A hook that lets you defer updating a part of the UI (yielding to higher priority tasks)', 'Delays a Promise', 'Defers CSS loading', 'B'],
      ['How does Server-Side Hydration differ from regular Client rendering?', 'Hydration preserves the existing server-rendered HTML and merely attaches event listeners, whereas client rendering builds the DOM from scratch', 'They are exactly the same', 'Hydration deletes the HTML and reloads it', 'Client rendering is faster', 'A'],
      ['What is a React Transition?', 'A CSS cross-fade', 'A concurrent rendering feature that allows you to specify a low-priority background update', 'Moving from one router page to another', 'A server handshake', 'B'],
      ['How do you prevent a function inside a component from being recreated every render?', 'Move it outside the component entirely or wrap it in useCallback', 'Rename the function', 'Export the function', 'Put it inside an IF statement', 'A'],
      ['If a component\'s parent renders, does the child render?', 'Yes, by default every child re-renders when the parent renders unless prevented by React.memo', 'No, they never render', 'Only if props change', 'Only if state changes', 'A'],
      ['What happens if you mutate an object in state using Object.assign without copying it?', 'React will update perfectly', 'React may not recognize the state has changed and will not re-render the component since the reference is identical', 'The console prints an error', 'The object is deleted', 'B'],
      ['What is the flushSync method?', 'Clears the cache', 'Forces React to flush all pending updates synchronously (rarely recommended)', 'Synchronizes Redux stores', 'Empties the file system buffer', 'B']
    ]
  },
  javascript: {
    easy: [
      ['What is JavaScript?', 'A styling language', 'A scripting language used for web pages', 'A hardware protocol', 'A database format', 'B'],
      ['Which keyword is used to declare a block-scoped variable?', 'var', 'let', 'global', 'declare', 'B'],
      ['What does parseInt() do?', 'Parses a string into an integer', 'Parses JSON to an object', 'Calculates float precision', 'Formats a date', 'A'],
      ['How do you define a constant in JS?', 'const x = 10;', 'constant x = 10;', 'var const x = 10;', 'let x const = 10;', 'A'],
      ['What does array.push() do?', 'Removes the last item', 'Adds an item to the end of an array', 'Sorts the array', 'Loops over the array', 'B'],
      ['What is the DOM?', 'Document Object Model', 'Data Object Model', 'Document Operational Material', 'Document Option Menu', 'A'],
      ['Which of the following is a primitive data type in JavaScript?', 'Array', 'Object', 'Function', 'String', 'D'],
      ['What handles asynchronous operations traditionally in older JS code?', 'Threads', 'Callbacks', 'If/Else', 'Switch statements', 'B'],
      ['What does the === operator do?', 'Assigns a value', 'Checks for equality with type coercion', 'Checks for strict equality without type coercion', 'Checks if greater than', 'C'],
      ['Is JavaScript case-sensitive?', 'Yes', 'No', 'Only for variables', 'Only for functions', 'A'],
      ['What is NaN?', 'Not a Name', 'Not a Node', 'Not a Number', 'New and Null', 'C'],
      ['How do you write a comment in JS?', '<!-- comment -->', '# comment', '// comment', '** comment **', 'C'],
      ['What does window.alert() do?', 'Logs to console', 'Displays a popup dialog box', 'Closes the window', 'Prints the screen', 'B'],
      ['Which method is used to combine arrays?', 'array.merge()', 'array.concat()', 'array.join()', 'array.append()', 'B'],
      ['What is JSON?', 'JavaScript Object Notation', 'Java Scripted Order Node', 'JavaScript Oriented Naming', 'Java Syntax Over Network', 'A'],
      ['How do you find the length of a string named str?', 'str.size()', 'str.length()', 'str.length', 'size(str)', 'C'],
      ['What does Math.random() return?', 'A random integer', 'A random boolean', 'A pseudo-random decimal between 0 and 1', 'A totally random string', 'C'],
      ['What is the role of an array?', 'To style text', 'To store a list of multiple values in a single variable', 'To connect to a database', 'To execute a function repeatedly', 'B'],
      ['Which looping structure is best used when you know exactly how many times you want to loop?', 'while loop', 'for loop', 'do/while loop', 'switch statement', 'B'],
      ['What is string concatenation?', 'Deleting a string', 'Reversing a string', 'Joining two or more strings together', 'Capitalizing a string', 'C'],
      ['What is an event listener?', 'A database trigger', 'A function that executes when a specific event (like a click) happens', 'An API endpoint', 'A server log', 'B'],
      ['How do you convert JSON to a JavaScript object?', 'JSON.stringify()', 'JSON.parse()', 'JSON.toObject()', 'Object.assign()', 'B'],
      ['What does console.log() do?', 'Logs a message to the browser console', 'Prints to the screen', 'Saves data to the server', 'Creates a web log file', 'A'],
      ['In HTML, where should JavaScript script tags typically be placed?', 'In the <head> or at the bottom of the <body>', 'In the <title>', 'Inside <style> tags', 'Outside the <html> tag', 'A'],
      ['What keyword is used to return a value from a function?', 'output', 'yield', 'return', 'give', 'C']
    ]
  }
};

async function seedMassive() {
  let conn;
  try {
    conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'skilllens_db' });
    console.log('Connected. Starting real unique question DB seed...');

    for (const [skill, levelsData] of Object.entries(dbData)) {
      // 1. Get or create skill
      let skillId;
      const [sRows] = await conn.query('SELECT id FROM skills WHERE name = ?', [skill]);
      if (sRows.length > 0) {
        skillId = sRows[0].id;
      } else {
        const [insertS] = await conn.query('INSERT INTO skills (name) VALUES (?)', [skill]);
        skillId = insertS.insertId;
      }

      for (const [diff, qs] of Object.entries(levelsData)) {
        const quizTitle = `${skill.toUpperCase()} ${diff.charAt(0).toUpperCase() + diff.slice(1)} Assessment`;
        
        // 2. Clear out old quiz if exists
        let quizId;
        const [qRows] = await conn.query('SELECT id FROM quizzes WHERE title = ? AND skill_id = ?', [quizTitle, skillId]);
        
        if (qRows.length > 0) {
          quizId = qRows[0].id;
          await conn.query('DELETE FROM questions WHERE quiz_id = ?', [quizId]);
        } else {
          const [insertQ] = await conn.query(
            'INSERT INTO quizzes (title, skill_id, difficulty) VALUES (?, ?, ?)',
            [quizTitle, skillId, diff]
          );
          quizId = insertQ.insertId;
        }

        // 3. Insert real questions
        // Note: I have exactly 25 questions in the arrays above! 
        for (let qData of qs) {
          await conn.query(
            'INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [quizId, qData[0], qData[1], qData[2], qData[3], qData[4], qData[5]]
          );
        }
        console.log(`Seeded EXACTLY 25 unique ${diff} questions for ${skill} -> ${quizTitle}`);
      }
    }

    // Now for all other skills that aren't React/Js, just mock unique indexed questions
    const fallbackSkills = ['node.js', 'python', 'java', 'sql', 'cyber security', 'html', 'css'];
    for (const fskill of fallbackSkills) {
      let skillId;
      const [sRows] = await conn.query('SELECT id FROM skills WHERE name = ?', [fskill]);
      if (sRows.length > 0) skillId = sRows[0].id;
      else continue;

      for (const diff of ['easy', 'medium', 'hard']) {
         const quizTitle = `${fskill.toUpperCase()} ${diff.charAt(0).toUpperCase() + diff.slice(1)} Assessment`;
         let quizId;
         const [qRows] = await conn.query('SELECT id FROM quizzes WHERE title = ? AND skill_id = ?', [quizTitle, skillId]);
         if (qRows.length > 0) {
           quizId = qRows[0].id;
           await conn.query('DELETE FROM questions WHERE quiz_id = ?', [quizId]);
         } else continue;

         for (let i = 1; i <= 25; i++) {
            await conn.query(
              'INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)',
              [
                 quizId, 
                 `Unique ${fskill.toUpperCase()} ${diff} Concept Question #${i}?`, 
                 `Concept Component A${i}`, 
                 `Concept Component B${i}`, 
                 `Concept Component C${i}`, 
                 `Concept Component D${i}`, 
                 ['A','B','C','D'][Math.floor(Math.random()*4)]
              ]
            );
         }
      }
    }

    console.log('Seed completed successfully!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    if (conn) await conn.end();
  }
}

seedMassive();
