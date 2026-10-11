import React from "react";
import CountUp from "react-countup";

const FeeInsights = ({ programs = [] }) => {
  if (!programs.length) return null;

  const fees = programs
    .map((recommendation) => recommendation?.evidence_fields?.semester_fee)
    .filter((fee) => fee !== undefined && fee !== null)
    .map(Number)
    .filter((fee) => !Number.isNaN(fee));

  if (!fees.length) return null;

  const minFee = Math.min(...fees);
  const maxFee = Math.max(...fees);
  const avgFee = fees.reduce((acc, fee) => acc + fee, 0) / fees.length;

  const stats = [
    {
      label: "Minimum Fee",
      value: minFee,
    },
    {
      label: "Maximum Fee",
      value: maxFee,
    },
    {
      label: "Average Fee",
      value: Math.round(avgFee),
    },
  ];

  return (
    <div className="flex-1 flex flex-col gap-5 bg-[#cbb1ef] px-6 py-6 rounded-2xl">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex-1 min-h-[120px] p-6 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center"
        >
          <h4 className="text-gray-600 mb-2">{stat.label}</h4>

          <CountUp
            start={0}
            end={stat.value}
            duration={1.5}
            separator=","
            prefix="Rs "
            className="text-2xl font-bold text-purple-700"
          />
        </div>
      ))}
    </div>
  );
};

export default FeeInsights;
