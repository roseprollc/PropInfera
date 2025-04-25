"use client";

interface Step {
  number: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "1",
    title: "Import Property",
    description: "Start by importing property data from Redfin or Zillow, or enter details manually"
  },
  {
    number: "2",
    title: "Adjust Assumptions",
    description: "Customize rental rates, expenses, and other key assumptions to match your strategy"
  },
  {
    number: "3",
    title: "Run AI Analysis",
    description: "Let our AI analyze the property and provide detailed investment insights"
  },
  {
    number: "4",
    title: "Export or Save Results",
    description: "Export your analysis or save it to your dashboard for future reference"
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-[#111111] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800
                hover:border-green-500 hover:shadow-[0_0_15px_#2ecc71]
                transition-all duration-300 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
              tabIndex={0}
            >
              <div className="text-[#2ecc71] text-2xl font-bold mb-2">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 