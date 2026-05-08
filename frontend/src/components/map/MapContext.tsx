import { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import Feature from 'ol/Feature';
import TileLayer from "ol/layer/Tile";
import VectorLayer from 'ol/layer/Vector';
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import "ol/ol.css";
import markerRed from './marker_red.png';
import markerBlue from './marker_blue.png';
import { type DroneTelemetry } from "../widgets/TelemetryContext";


export default function MapContext({ telemetry, pilot }: { telemetry: DroneTelemetry | undefined, pilot: DroneTelemetry | undefined }) {
  const mapElement = useRef<HTMLDivElement>(undefined);
  const mapRef = useRef<Map>(undefined);


  const dronePoint = new Point(fromLonLat([20.456, 53.7435]));
  const droneFeature = new Feature(dronePoint);
  droneFeature.setStyle(
    new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: markerRed,
      }),
    }),
  );
  const pilotPoint = new Point(fromLonLat([20.456, 53.7435]));
  const pilotFeature = new Feature(pilotPoint);
  pilotFeature.setStyle(
    new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: markerBlue,
      }),
    }),
  );

  useEffect(() => {
    mapRef.current = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: new VectorSource({
            features: [droneFeature, pilotFeature],
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([20.456, 53.7435]),
        zoom: 17,
      }),
    });
    return () => {
      mapRef.current?.setTarget(undefined);
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    const lon = pilot?.data.longitude;
    const lat = pilot?.data.latitude;
    if (lon != null && lat != null) {
      pilotPoint.setCoordinates(fromLonLat([lon, lat]));
    }
  }, [pilot]);

  useEffect(() => {
    if (!mapRef.current) return;
    const lon = telemetry?.data.longitude;
    const lat = telemetry?.data.latitude;
    if (lon != null && lat != null) {
      const pos = fromLonLat([lon, lat]);
      dronePoint.setCoordinates(pos);
      mapRef.current
        .getView()
        .animate({
          center: pos,
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
            <div ref={mapElement} className="w-full h-[248px] rounded-xl flex content-center items-center relative" />
          </div>
        </div>
      </div>
    </>
  );
}

// {"gateway": "MichaelJacksonHEEHEE", "data": {"latitude": 53.76434, "longitude": 20.518822, "height": 24.834}}
