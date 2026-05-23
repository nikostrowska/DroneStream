import { useEffect, useMemo, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import Feature from "ol/Feature";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import "ol/ol.css";
import droneMarker from "../../assets/droneIcon.png";
import pilotMarker from "../../assets/pilotIcon.png";
import { type DroneTelemetry } from "../widgets/TelemetryContext";

export default function MapContext({ droneTelemetry, pilotTelemetry }: { droneTelemetry: DroneTelemetry | undefined, pilotTelemetry: DroneTelemetry | undefined }) {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const droneRef = useRef<Point | null>(null);
  const pilotRef = useRef<Point | null>(null);
  const droneFeatureRef = useRef<Feature | null>(null);
  const pilotFeatureRef = useRef<Feature | null>(null);
  const droneMarkerStyle = useMemo(
    () =>
      new Style({
        image: new Icon({
          anchor: [0.5, 0.5],
          src: droneMarker,
          scale: 0.05,
        }),
      }),
    [],
  );
  const pilotMarkerStyle = useMemo(
    () =>
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: pilotMarker,
        }),
      }),
    [],
  );
  useEffect(() => {
    if (!mapElement.current) return;
    droneRef.current = new Point(fromLonLat([20.4, 53.7435]));
    pilotRef.current = new Point(fromLonLat([20.456, 53.7435]));
    droneFeatureRef.current = new Feature(droneRef.current);
    pilotFeatureRef.current = new Feature(pilotRef.current);
    droneFeatureRef.current.setStyle(droneMarkerStyle);
    pilotFeatureRef.current.setStyle(pilotMarkerStyle);

    mapRef.current = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: new VectorSource({
            features: [droneFeatureRef.current, pilotFeatureRef.current],
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
  }, [droneMarkerStyle, pilotMarkerStyle]);

  useEffect(() => {
    if (!mapRef.current || !pilotRef.current) return;
    const lon = pilotTelemetry?.data?.longitude;
    const lat = pilotTelemetry?.data?.latitude;
    if (lon != null && lat != null) {
      const pos = fromLonLat([lon, lat]);
      pilotRef.current.setCoordinates(pos);
      mapRef.current.getView().animate({
        center: pos,
        duration: 500,
      });
    }
  }, [pilotTelemetry]);

  useEffect(() => {
    if (!mapRef.current || !droneRef.current) return;
    const lon = droneTelemetry?.data?.longitude;
    const lat = droneTelemetry?.data?.latitude;
    if (lon != null && lat != null) {
      const pos = fromLonLat([lon, lat]);
      droneRef.current.setCoordinates(pos);
      mapRef.current.getView().animate({
        center: pos,
        duration: 500,
      });
    }
  }, [droneTelemetry]);


  return (
    <>
      <div className="w-full bg-white/20 rounded-xl shadow-sm border border-white/20 p-4 flex flex-col gap-2">
        <div className="flex mx auto flex-col gap-2 w-full">
          <h3 className="text-[16px] font-bold text-[#676262] uppercase tracking-widest">
            Map
          </h3>
          <div className="w-full">
            <div
              ref={mapElement}
              className="w-full h-[248px] rounded-xl overflow-hidden flex content-center items-center relative"
            />
          </div>
        </div>
      </div>
    </>
  );
}
