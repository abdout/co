import { FontDemo } from "@/components/font-demo";

export default function FontDemoPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Font Demo Page</h1>
      <p className="mb-6">
        This page demonstrates the JetBrains Mono font integration in our project.
        JetBrains Mono is a free and open-source typeface for developers 
        featuring programming ligatures for improved code readability.
      </p>
      
      <FontDemo />
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">How to Use JetBrains Mono</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Using Tailwind Classes</h3>
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
              className="font-mono"
            </code>
            <p className="mt-2">
              The <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded font-mono">font-mono</code> class
              has been configured to use JetBrains Mono as the primary font.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Using Custom CSS Classes</h3>
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
              className="font-jetbrains"
            </code>
            <p className="mt-2">
              We've also added a <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded font-mono">font-jetbrains</code> class
              that explicitly uses JetBrains Mono.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">For Code Blocks with Ligatures</h3>
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
              className="code-block"
            </code>
            <p className="mt-2">
              The <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded font-mono">code-block</code> class
              uses JetBrains Mono with programming ligatures enabled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 