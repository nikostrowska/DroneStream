import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";

export interface DroneTelemetry {
  gateway: string;
  data: {
    latitude: number;
    longitude: number;
    height: number;
  };
}

export default function MapContext({ telemetry }: { telemetry: DroneTelemetry | null }) {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  useEffect(() => {
    mapRef.current = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([20.456, 53.7435]),
        zoom: 17,
      }),
    });

    return () => {
      mapRef.current?.setTarget(null);
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    const lon = telemetry?.data?.longitude;
    const lat = telemetry?.data?.latitude;
    if (lon != null && lat != null) {
      mapRef.current
        .getView()
        .animate({
          center: fromLonLat([lon, lat]),
          duration: 500,
        });
    }
  }, [telemetry]);

  return (
    <>
      <div className="w-full bg-white rounded-widget shadow-sm border border-gray-100 p-4 flex flex-col gap-2">
        <div className="flex mx auto flex-col gap-2 w-full">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Map
          </h3>
          <div className="w-full">
            <div ref={mapElement} className="w-full h-[248px] rounded-xl" />
          </div>
        </div>
      </div>
    </>
  );
}

// {"gateway": "MichaelJacksonHEEHEE", "data": {"latitude": 53.76434, "longitude": 20.518822, "height": 24.834}}
