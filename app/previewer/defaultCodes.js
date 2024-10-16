// defaultCodes.js

const defaultCodes = {
    javascript: `
  function MyComponent() {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Hello, JavaScript!</h1>
        <p>This is a live component preview!</p>
        <button onClick={() => alert('Button clicked!')}>Click Me!</button>
      </div>
    );
  }
  MyComponent; // Return the component function itself
  `,
  
    typescript: `
  function MyComponent(): JSX.Element {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Hello, TypeScript!</h1>
        <p>This is a live component preview!</p>
        <button onClick={() => alert('Button clicked!')}>Click Me!</button>
      </div>
    );
  }
  MyComponent; // Return the component function itself
  `,
  
    html: `
  <div style="text-align: center; padding: 20px;">
    <h1>Hello, HTML!</h1>
    <p>This is a live HTML preview!</p>
    <button onclick="alert('Button clicked!')">Click Me!</button>
  </div>
  `,
  
 
  };
  
  export default defaultCodes;
  