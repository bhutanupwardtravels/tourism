"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

interface BhutanMapProps {
  highlightDestination?: string; // slug of the destination to highlight
  route?: {
    start: [number, number];
    end: [number, number];
  };
  coordinates?: [number, number];
}

export function BhutanMap({ highlightDestination, coordinates, route }: BhutanMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/Bhutan_ADM2.topojson");
        if (!response.ok) throw new Error("Failed to fetch map data");
        const bhutanData = await response.json();

        // Check keys to find the object name
        const objectKey = Object.keys(bhutanData.objects)[0];
        const featureCollection = topojson.feature(
          bhutanData as any,
          bhutanData.objects[objectKey] as any
        );
        setGeoJsonData(featureCollection);
      } catch (error) {
        console.error("Error loading map data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !geoJsonData) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 500;

    // Clear previous SVG
    d3.select(container).selectAll("*").remove();

    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("background-color", "transparent");

    // Create projection
    const projection = d3
      .geoMercator()
      .center([90.4336, 27.5142]) // Center of Bhutan
      .scale(width * 10)
      .translate([width / 2, height / 2]);

    // Auto-fit logic
    projection.fitSize([width, height], geoJsonData);

    const path = d3.geoPath().projection(projection);

    // Draw map
    svg
      .selectAll("path")
      .data(geoJsonData.features)
      .enter()
      .append("path")
      .attr("d", path as any)
      .attr("fill", (d: any) => {
        const districtName = d.properties?.shapeName || "";
        if (
          highlightDestination &&
          districtName.toLowerCase() === highlightDestination.toLowerCase()
        ) {
          return "#fbbf24";
        }
        return "#e5e7eb";
      })
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1)
      .attr("class", "transition-colors duration-300 hover:fill-gray-300 shadow-sm")
      .style("cursor", "pointer");

    // Add marker if coordinates provided
    if (coordinates) {
      const [lat, long] = coordinates;
      const point = projection([long, lat]);

      if (point) {
        drawMarker(svg, point[0], point[1]);
      }
    }

    // Draw Route if provided
    if (route) {
      const startPoint = projection([route.start[1], route.start[0]]);
      const endPoint = projection([route.end[1], route.end[0]]);

      if (startPoint && endPoint) {
        // Draw markers for start and end
        drawMarker(svg, startPoint[0], startPoint[1]);
        drawMarker(svg, endPoint[0], endPoint[1]);

        // Draw curved line
        const dx = endPoint[0] - startPoint[0];
        const dy = endPoint[1] - startPoint[1];
        const dr = Math.sqrt(dx * dx + dy * dy); // Curve radius

        // SVG Path for arc
        const pathData = `M${startPoint[0]},${startPoint[1]}A${dr},${dr} 0 0,1 ${endPoint[0]},${endPoint[1]}`;

        // Define arrowhead marker
        svg.append("defs").append("marker")
          .attr("id", "arrow")
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 8) // Position of arrow relative to line end
          .attr("refY", 0)
          .attr("markerWidth", 6)
          .attr("markerHeight", 6)
          .attr("orient", "auto")
          .append("path")
          .attr("d", "M0,-5L10,0L0,5")
          .attr("class", "arrowHead")
          .style("fill", "#fbbf24");

        // Draw the path
        const routePath = svg.append("path")
          .attr("d", pathData)
          .style("fill", "none")
          .style("stroke", "#fbbf24")
          .style("stroke-width", 2)
          .style("stroke-dasharray", "5,5") // Dashed line
          .attr("marker-end", "url(#arrow)") // Attach arrow
          .style("opacity", 0);

        // Animate line
        routePath.transition()
          .duration(2000)
          .style("opacity", 1);
      }
    }

  }, [geoJsonData, highlightDestination, coordinates, route]);

  return <div ref={containerRef} className="w-full h-full min-h-[400px]" />;
}

// Helper to draw a standard location marker
function drawMarker(svg: any, x: number, y: number) {
  // Ripple effect
  const ripple = svg
    .append("circle")
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", 8)
    .attr("fill", "none")
    .attr("stroke", "#fbbf24")
    .attr("stroke-width", 1)
    .attr("opacity", 1);

  ripple
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .attr("r", 30)
    .attr("opacity", 0)
    .on("end", function (this: SVGCircleElement) {
      repeat.call(this);
    });

  // Main marker point
  svg
    .append("circle")
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", 5)
    .attr("fill", "#fbbf24")
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 2)
    .style("filter", "drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))");
}

function repeat(this: SVGCircleElement) {
  d3.select(this)
    .attr("r", 8)
    .attr("opacity", 1)
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .attr("r", 30)
    .attr("opacity", 0)
    .on("end", function (this: SVGCircleElement) {
      repeat.call(this);
    });
}
