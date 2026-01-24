export namespace enigmaData {
    let sampleFieldMessages: ({
        source: string;
        model: string;
        setup: {
            reflector: string;
            rotors: string[];
            ringSettings: number[];
            plugs: string;
        };
        message: {
            key: string;
            encoded: string;
            decoded: string;
        };
    } | {
        source: string;
        model: string;
        setup: {
            reflector: string;
            rotors: string[];
            ringSettings: string;
            plugs: string;
        };
        message: {
            key: string;
            encoded: string;
            decoded: string;
        };
    })[];
    let sampleVerifiedMessages: {
        verified: string[];
        model: string;
        setup: {
            rotors: string[];
            plugs: string;
            ringSettings: number[];
            reflector: string;
        };
        message: {
            key: string;
            encoded: string;
            decoded: string;
        };
    }[];
}
