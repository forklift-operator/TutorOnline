import { useEffect, useState } from "react"
import { useParams } from "react-router";
import Meet from "./Meet";
import type SocketService from "@/services/socketService";
import type PeerService from "@/services/peerService";
import type { HTTPResponse } from "@/common/commonTypes";

type Props = {
    onValidate: (id: string) => Promise<HTTPResponse>;
    socketService: SocketService;
    peerService: PeerService;
}

export default function ValidateMeet({onValidate, peerService, socketService}: Props) {
    const { lessonId } = useParams<string>();
    const [error, setError] = useState<string | null>(null);
    const [validated, setValidated] = useState(false);

    const validate = async () => {
        if (!lessonId) {
            setError('invalid');
            setValidated(true);
            return;
        }
        try {
            const result: HTTPResponse = await onValidate(lessonId);

            if (result) {
                setError(result.message);
            } else {
                setError(null);
            }
        } catch (e) {
            setError((e as Error).message);
        } finally {
            console.log("result");
        }
        setValidated(true);
    };

    useEffect(() => {
        if (lessonId) validate();
        else {
            setError("invalid");
            setValidated(true);
        }
    }, [lessonId]);

    if (!validated) return <Meet socketService={socketService} peerService={peerService}/>;

    if (!error) return <Meet socketService={socketService} peerService={peerService} valid />;

    return <Meet socketService={socketService} peerService={peerService} error={error} />;
}
