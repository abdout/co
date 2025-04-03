'use client';

/**
 * A component to demonstrate JetBrains Mono font with programming ligatures
 */
export const FontDemo = () => {
  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <h2 className="text-xl font-bold">JetBrains Mono Font Demo</h2>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-500">Normal text in the default font</p>
        <p className="font-mono text-sm text-gray-700 dark:text-gray-300">
          This text uses the JetBrains Mono font as configured in Tailwind
        </p>
      </div>
      
      {/* Code block to demonstrate programming ligatures */}
      <div className="space-y-2">
        <p className="text-sm text-gray-500">Programming ligatures demonstration:</p>
        <pre className="code-block bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto">
          <code className="text-sm">
            {`// Arrow function with fat arrow ligature
const add = (a, b) => a + b;

// Comparison operators with ligatures
if (value !== undefined && value >= 10) {
  // Double equals and triple equals as ligatures
  if (value == null || value === 0) {
    return false;
  }
}

// Logical operators with ligatures
const result = first && second || third;

// Arrow and equation ligatures
const filter = items.filter(item => item.value <= 100);

// Comment syntax ligatures
// This is a comment
/* This is a block comment */

// These should have special ligatures: 
// --> >= <= == === != !== ::`}
          </code>
        </pre>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-500">Font comparison:</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-bold mb-2">Sans Font:</h3>
            <p className="font-sans text-sm">
              function example() {<br />
              &nbsp;&nbsp;return x !== y && z >= 10;<br />
              }
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold mb-2">JetBrains Mono:</h3>
            <p className="font-mono text-sm">
              function example() {<br />
              &nbsp;&nbsp;return x !== y && z >= 10;<br />
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 