import {Button} from "antd";

const CreateTableDataBtn = ({marginBottom, onClick}) => {
    return (
        <>
            <Button style={{
                marginBottom,
                minWidth: '80px',
            }}
                    onClick={onClick}
            >Add</Button>
        </>
    );
};

export default CreateTableDataBtn;