import React, {useCallback, useState} from 'react';
import { useDropzone } from 'react-dropzone';

const DragAndDrop = () => {
    const [image, setImage] = useState(null);
    const [text, setText] = useState('');

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;

        setImage(acceptedFiles[0]);

        const formData = new FormData();
        formData.append('file', image);


    }, [image]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} style={{
            border: '2px dashed #cccccc',
            borderRadius: '4px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            width: '100%',
        }}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Перетащите файлы сюда...</p> :
                    <p>Перетащите файлы сюда...</p>
            }
        </div>
    );
};

export default DragAndDrop;
