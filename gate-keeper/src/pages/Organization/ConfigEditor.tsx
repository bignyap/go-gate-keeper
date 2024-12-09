import React, { useState, useEffect, useRef } from 'react';
import { Box, Button } from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

interface ConfigEditorProps {
    config: string;
    onConfigChange: (newConfig: string) => void;
    editorMode?: boolean;
    alwaysEditMode?: boolean; 
    editorWidth?: string;
    editorHeight?: string;
}

const ConfigEditor: React.FC<ConfigEditorProps> = ({ 
    config, onConfigChange, 
    editorMode = false, 
    alwaysEditMode = true,
    editorWidth = '100%',
    editorHeight = '100%'
}) => {
    const [isConfigEditMode, setIsConfigEditMode] = useState<boolean>(editorMode);
    const editorRef = useRef<any>(null); // Use a ref to store the editor instance

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.setOption('readOnly', alwaysEditMode? false : !isConfigEditMode);
        }
    }, [alwaysEditMode, isConfigEditMode]);

    return (
        <>
            {!alwaysEditMode && !isConfigEditMode ? (
                <Box 
                    display="flex" 
                    justifyContent="flex-end" 
                    alignItems="center" 
                    mb={2} 
                    position="relative" 
                    top={8} 
                    right={8}
                >
                    <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        color="primary"
                        onClick={() => setIsConfigEditMode(true)}
                    >
                        Edit
                    </Button>
                </Box>
            ) : !alwaysEditMode && (
                <Box 
                    display="flex" 
                    justifyContent="flex-end" 
                    alignItems="center" 
                    mb={2} 
                    position="relative" 
                    top={8} 
                    right={8}
                >
                    <Button
                        variant="contained"
                        startIcon={<Save />}
                        color="primary"
                        onClick={() => {
                            setIsConfigEditMode(false);
                        }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        color="primary"
                        sx={{ ml: 2 }}
                        onClick={() => setIsConfigEditMode(false)}
                    >
                        Cancel
                    </Button>
                </Box>
            )}
            
            <CodeMirror
                value={config}
                options={{
                    mode: 'text',
                    lineNumbers: true,
                    theme: 'default',
                    readOnly: alwaysEditMode? false : !isConfigEditMode
                }}
                onBeforeChange={(editor, data, value) => {
                    onConfigChange(value);
                }}
                editorDidMount={(editor) => {
                    editorRef.current = editor;
                    editor.setSize(editorWidth, editorHeight);
                    const wrapper = editor.getWrapperElement();
                    wrapper.style.textAlign = 'left';
                    wrapper.style.backgroundColor = '#f0f0f0';
                    wrapper.style.fontSize = '16px';
                }}
            />
        </>
    );
};

export default ConfigEditor;