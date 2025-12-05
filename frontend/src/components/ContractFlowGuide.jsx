import { FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

export const ContractFlowGuide = () => {
  const steps = [
    {
      number: 1,
      title: 'Approve Tokens',
      description: 'Grant the contract permission to spend your ERC20 tokens',
      icon: FiCheckCircle,
      color: 'blue',
    },
    {
      number: 2,
      title: 'Create Project',
      description: 'Fill in project details and assign to a contractor',
      icon: FiCheckCircle,
      color: 'green',
    },
    {
      number: 3,
      title: 'Contractor Submits',
      description: 'Contractor submits project deliverables with proof',
      icon: FiCheckCircle,
      color: 'purple',
    },
    {
      number: 4,
      title: 'Review & Approve',
      description: 'Review submission and approve or reject milestone',
      icon: FiCheckCircle,
      color: 'orange',
    },
  ];

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <div className="flex items-center gap-2 mb-6">
        <FiInfo className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-bold text-white">Contract Workflow</h3>
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="flex gap-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${colorClasses[step.color]} flex items-center justify-center`}>
                <span className="text-white font-bold text-sm">{step.number}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-1">{step.title}</h4>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className="absolute left-5 top-full h-4 w-0.5 bg-gradient-to-b from-slate-600 to-transparent"></div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 flex items-start gap-3">
        <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium mb-1">Important Notes:</p>
          <ul className="text-xs opacity-75 space-y-1">
            <li>• Always approve tokens before creating projects</li>
            <li>• Ensure contractor address is correct before submission</li>
            <li>• Review all project details carefully</li>
            <li>• Keep track of project deadlines</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
