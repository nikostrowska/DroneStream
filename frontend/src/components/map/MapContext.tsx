export interface DroneTelemetry {
  gateway: string;
  data: {
    latitude: number;
    longitude: number;
    height: number;
  };
}

export default function MapContext() {
  return (
    <>
      <div className="w-full bg-white rounded-widget shadow-sm border border-gray-100 p-4 flex flex-col gap-2">
        <div className="flex mx auto flex-col gap-2 w-full">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Map
          </h3>
          <div className="w-full">
            <iframe
              className="w-full min-h-[248px] rounded-xl"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2567.745454545454!2d21.0122!3d52.2297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471e8459a0c9c9c9%3A0x471e8459a0c9c9c9!2sWarsaw%2C%20Poland!5e0!3m2!1sen!2sde!4v1634567890123!5m !6e0"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}

// {"gateway": "MichaelJacksonHEEHEE", "data": {"latitude": 53.76434, "longitude": 20.518822, "height": 24.834}}
