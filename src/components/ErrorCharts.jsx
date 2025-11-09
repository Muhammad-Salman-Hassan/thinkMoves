import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            fontFamily: "'Clash Display', sans-serif",
          }}
        >
          <p style={{ margin: 0, fontWeight: "normal" }}>Ply: {label} - {label%2===0?"Black Move":"White Move"}</p>
          {payload.map((entry) => (
            <p key={entry.dataKey} style={{ color: entry.color, margin: 0 }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
  
    return null;
  };


const ChartComponent = ({ data }) => (
  <AreaChart
    width={"100%"}
    height={300}
    data={data}
    margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
  >
    <defs>
   
      <linearGradient id="gradientError" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(250,103,244,0.2)" />
        <stop offset="100%" stopColor="rgba(250,103,244,0)" />
      </linearGradient>

      <linearGradient id="gradientEvalBefore" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(77,102,235,0.2)" />
        <stop offset="100%" stopColor="rgba(77,102,235,0)" />
      </linearGradient>

     
      <linearGradient id="gradientEvalAfter" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(235,77,102,0.2)" />
        <stop offset="100%" stopColor="rgba(235,77,102,0)" />
      </linearGradient>
    </defs>

    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
    <XAxis dataKey="ply" />
    <YAxis />
    <Tooltip content={<CustomTooltip />}/>
    <Legend />

    
    <Area
      type="monotone"
      dataKey="lossCp"
      stroke="#FA67F4"
      fill="url(#gradientError)"
      name="Error (CP Loss)"
    />

   
    <Area
      type="monotone"
      dataKey="evalBeforeCp"
      stroke="#4D66EB"
      fill="url(#gradientEvalBefore)"
      name="Eval Before"
    />

   
    <Area
      type="monotone"
      dataKey="evalAfterCp"
      stroke="#EB4D66"
      fill="url(#gradientEvalAfter)"
      name="Eval After"
    />
  </AreaChart>
);

export default ChartComponent;
