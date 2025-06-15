import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/helpers";

const PropertyMap = ({ onPropertyClick }) => {
  const {
    data: properties = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const response = await api.get("/property");
      return response.data.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading properties</div>;

  const getPropertyColor = (typeName) => {
    switch (typeName) {
      case "50":
        return "#FF9B50";
      case "60":
        return "#87CEEB";
      case "80":
        return "#FFFF00";
      default:
        return "#CCCCCC";
    }
  };

  const renderProperties = () => {
    const type50 = properties.filter((p) => p.type_name === "50");
    const type60 = properties.filter((p) => p.type_name === "60");
    const type80 = properties.filter((p) => p.type_name === "80");

    return (
      <>
        {/* Type 50 Properties */}
        {type50.slice(0, 6).map((property, index) => (
          <rect
            key={property.property_id}
            x="60"
            y={50 + index * 60}
            width="70"
            height="50"
            fill="#FF9B50"
            stroke="black"
            onClick={() => onPropertyClick(property)}
            style={{ cursor: "pointer" }}
          />
        ))}
        {type50.slice(6, 12).map((property, index) => (
          <rect
            key={property.property_id}
            x="140"
            y={50 + index * 60}
            width="70"
            height="50"
            fill="#FF9B50"
            stroke="black"
            onClick={() => onPropertyClick(property)}
            style={{ cursor: "pointer" }}
          />
        ))}

        {/* Type 60 Properties */}
        {type60.slice(0, 5).map((property, index) => (
          <rect
            key={property.property_id}
            x="220"
            y={50 + index * 60}
            width="70"
            height="50"
            fill="#87CEEB"
            stroke="black"
            onClick={() => onPropertyClick(property)}
            style={{ cursor: "pointer" }}
          />
        ))}
        {type60.slice(5, 10).map((property, index) => (
          <rect
            key={property.property_id}
            x="300"
            y={50 + index * 60}
            width="70"
            height="50"
            fill="#87CEEB"
            stroke="black"
            onClick={() => onPropertyClick(property)}
            style={{ cursor: "pointer" }}
          />
        ))}

        {/* Type 80 Properties */}
        {type80.slice(0, 3).map((property, index) => (
          <rect
            key={property.property_id}
            x="380"
            y={50 + index * 60}
            width="70"
            height="50"
            fill="#FFFF00"
            stroke="black"
            onClick={() => onPropertyClick(property)}
            style={{ cursor: "pointer" }}
          />
        ))}
      </>
    );
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 600"
      style={{
        maxWidth: "100%",
        height: "auto",
        border: "1px solid black",
      }}
    >
      {/* Background with green area */}
      <rect width="800" height="600" fill="#90EE90" />

      {/* Main property area background */}
      <rect
        x="40"
        y="40"
        width="420"
        height="420"
        fill="#f0f0f0"
        stroke="black"
      />

      {/* Trees/Green circles */}
      {[50, 100, 150, 200, 250, 300].map((cy) => (
        <circle key={`tree-left-${cy}`} cx="30" cy={cy} r="10" fill="#228B22" />
      ))}
      {[50, 100, 150, 200, 250].map((cy) => (
        <circle
          key={`tree-right-${cy}`}
          cx="480"
          cy={cy}
          r="10"
          fill="#228B22"
        />
      ))}
      {[100, 150, 200, 250, 300].map((cx) => (
        <circle
          key={`tree-bottom-${cx}`}
          cx={cx}
          cy="480"
          r="10"
          fill="#228B22"
        />
      ))}

      {/* Render properties */}
      {renderProperties()}

      {/* <!-- Type 50 Properties (Orange) - 12 units --> */}
      <a href="#type50-1">
        <rect
          x="60"
          y="50"
          width="70"
          height="50"
          fill="#FF9B50"
          stroke="black"
        />
      </a>
      <a href="#type50-2">
        <rect
          x="60"
          y="110"
          width="70"
          height="50"
          fill="#FF9B50"
          stroke="black"
        />
      </a>
      <a href="#type50-3">
        <rect
          x="60"
          y="170"
          width="70"
          height="50"
          fill="#FF9B50"
          stroke="black"
        />
      </a>
      <a href="#type50-4">
        <rect
          x="60"
          y="230"
          width="70"
          height="50"
          fill="#FF9B50"
          stroke="black"
        />
      </a>
      <a href="#type50-5">
        <rect
          x="60"
          y="290"
          width="70"
          height="50"
          fill="#FF9B50"
          stroke="black"
        />
      </a>
      <a href="#type50-6">
        <rect
          x="60"
          y="350"
          width="70"
          height="50"
          fill="#FF9B50"
          stroke="black"
        />
      </a>

      <a href="#type50-7">
        <rect
          x="140"
          y="50"
          width="70"
          height="50"
          fill="#FF9B50"
          stroke="black"
        />
      </a>
      <a href="#type50-8">
        <rect
          x="140"
          y="110"
          width="70"
          height="50"
          fill="#FF9B50"
          stroke="black"
        />
      </a>
      <a href="#type50-9">
        <rect
          x="140"
          y="170"
          width="70"
          height="50"
          fill="#FF9B50"
          stroke="black"
        />
      </a>
      <a href="#type50-10">
        <rect
          x="140"
          y="230"
          width="70"
          height="50"
          fill="#FF9B50"
          stroke="black"
        />
      </a>
      <a href="#type50-11">
        <rect
          x="140"
          y="290"
          width="70"
          height="50"
          fill="#FF9B50"
          stroke="black"
        />
      </a>
      <a href="#type50-12">
        <rect
          x="140"
          y="350"
          width="70"
          height="50"
          fill="#FF9B50"
          stroke="black"
        />
      </a>

      {/* <!-- Type 60 Properties (Blue) - 10 units --> */}
      <a href="#type60-1">
        <rect
          x="220"
          y="50"
          width="70"
          height="50"
          fill="#87CEEB"
          stroke="black"
        />
      </a>
      <a href="#type60-2">
        <rect
          x="220"
          y="110"
          width="70"
          height="50"
          fill="#87CEEB"
          stroke="black"
        />
      </a>
      <a href="#type60-3">
        <rect
          x="220"
          y="170"
          width="70"
          height="50"
          fill="#87CEEB"
          stroke="black"
        />
      </a>
      <a href="#type60-4">
        <rect
          x="220"
          y="230"
          width="70"
          height="50"
          fill="#87CEEB"
          stroke="black"
        />
      </a>
      <a href="#type60-5">
        <rect
          x="220"
          y="290"
          width="70"
          height="50"
          fill="#87CEEB"
          stroke="black"
        />
      </a>

      <a href="#type60-6">
        <rect
          x="300"
          y="50"
          width="70"
          height="50"
          fill="#87CEEB"
          stroke="black"
        />
      </a>
      <a href="#type60-7">
        <rect
          x="300"
          y="110"
          width="70"
          height="50"
          fill="#87CEEB"
          stroke="black"
        />
      </a>
      <a href="#type60-8">
        <rect
          x="300"
          y="170"
          width="70"
          height="50"
          fill="#87CEEB"
          stroke="black"
        />
      </a>
      <a href="#type60-9">
        <rect
          x="300"
          y="230"
          width="70"
          height="50"
          fill="#87CEEB"
          stroke="black"
        />
      </a>
      <a href="#type60-10">
        <rect
          x="300"
          y="290"
          width="70"
          height="50"
          fill="#87CEEB"
          stroke="black"
        />
      </a>

      {/* <!-- Type 80 Properties (Yellow) - 3 units --> */}
      <a href="#type80-1">
        <rect
          x="380"
          y="50"
          width="70"
          height="50"
          fill="#FFFF00"
          stroke="black"
        />
      </a>
      <a href="#type80-2">
        <rect
          x="380"
          y="110"
          width="70"
          height="50"
          fill="#FFFF00"
          stroke="black"
        />
      </a>
      <a href="#type80-3">
        <rect
          x="380"
          y="170"
          width="70"
          height="50"
          fill="#FFFF00"
          stroke="black"
        />
      </a>
      {/* Legend Box */}
      <rect
        x="500"
        y="50"
        width="200"
        height="120"
        fill="white"
        stroke="black"
      />
      <rect x="520" y="70" width="20" height="20" fill="#FFFF00" />
      <text x="550" y="85" fontSize="14">
        Tipe 80
      </text>
      <rect x="520" y="100" width="20" height="20" fill="#87CEEB" />
      <text x="550" y="115" fontSize="14">
        Tipe 60
      </text>
      <rect x="520" y="130" width="20" height="20" fill="#FF9B50" />
      <text x="550" y="145" fontSize="14">
        Tipe 50
      </text>

      {/* Compass */}
      <text x="700" y="200" fontSize="24" fill="black">
        N
      </text>
      <text x="700" y="250" fontSize="24" fill="black">
        E
      </text>
      <text x="650" y="250" fontSize="24" fill="black">
        W
      </text>
      <text x="700" y="300" fontSize="24" fill="black">
        S
      </text>
    </svg>
  );
};

export default PropertyMap;
