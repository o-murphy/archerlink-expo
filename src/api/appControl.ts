const BASE_LOCATION = __DEV__ ? '127.0.0.1:15010' : window.location.host;


export const openMedia = async () => {
    const response = await fetch(`http://${BASE_LOCATION}/api/media`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return await response.json();
}

export const takePhoto = async () => {
    const response = await fetch(`http://${BASE_LOCATION}/api/photo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return await response.json();
};

export const toggleRecording = async () => {
    const response = await fetch(`http://${BASE_LOCATION}/api/record`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return await response.json();
};

export const fetchRecordingState = async () => {
    const response = await fetch(`http://${BASE_LOCATION}/api/record/state`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return await response.json();
};

export const fetchDeviceControl = async (action: string) => {
    const response = await fetch(`http://${BASE_LOCATION}/api/control`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"action": action})
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return await response.json();
};

export const fetchStopServer = async () => {
    const response = await fetch(`http://${BASE_LOCATION}/api/server/stop`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return await response.json();
};