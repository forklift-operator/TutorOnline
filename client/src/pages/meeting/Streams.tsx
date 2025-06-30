import { useEffect, useRef } from 'react';

type Props = {
    myStream: MediaStream;
    remoteStreams: MediaStream[];
    children?: React.ReactNode;
};

export default function Streams({ myStream, remoteStreams, children }: Props) {
    const myStreamRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (myStreamRef.current && myStream instanceof MediaStream) {
            myStreamRef.current.srcObject = myStream;
        }
    }, [myStream]);

    return (
        
        <div className="self flex flex-row box-border w-fit relative">
            <video
                ref={myStreamRef}
                autoPlay
                muted
                playsInline
                className="rounded-xl w-auto h-full bg-black object-cover"
            />
            <div
                className="remote grid grid-cols-5 gap-3 items-center object-cover absolute top-5 left-5"
                style={{ gridTemplateRows: '200px' }}
            >
                {remoteStreams.map((stream) => (
                    <video
                        key={stream.id}
                        autoPlay
                        playsInline
                        width={300}
                        height={200}
                        className="rounded-xl w-[300px] h-[200px] object-cover bg-black shadow-lg"
                        ref={(el) => {
                            if (el) el.srcObject = stream;
                        }}
                    />
                ))}
            </div>
            {children}
        
        </div> 
    );
}
