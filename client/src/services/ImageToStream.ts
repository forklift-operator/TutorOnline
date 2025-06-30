export async function createImageVideoStream(imageUrl: string, width = 640, height = 480): Promise<MediaStream> {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Optional: depends on your image source
        img.src = imageUrl;

        img.onload = () => {
            // Draw image every frame
            setInterval(() => {
                ctx?.drawImage(img, 0, 0, width, height);
            }, 1000 / 30); // simulate 30fps

            const stream = canvas.captureStream(30); // 30fps stream
            resolve(stream);
        };

        img.onerror = reject;
    });
}
