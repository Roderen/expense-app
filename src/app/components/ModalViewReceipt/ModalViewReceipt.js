import React, {memo, useEffect, useState} from 'react';
import {Button, Modal, Table} from "antd";
import { v4 as uuidv4 } from 'uuid';
import {useReceiptsStore} from "@/app/store/store";

const ModalViewReceipt = memo(({ open, handleCancel, receiptId }) => {
    const receiptsData = useReceiptsStore((state) => state.receipts);
    const [singleReceipt, setSingleReceipt] = useState({});

    useEffect(() => {
        if (receiptId) {
            const updatedReceiptsData = receiptsData.map(receipt => ({
                ...receipt,
                inputRecipeList: Array.isArray(receipt.inputRecipeList) ?
                    receipt.inputRecipeList.map(item => ({
                        ...item,
                        id: item.id || uuidv4()
                    }))
                    : []
            }));


            const receipt = updatedReceiptsData.find((receipt) => receipt.id === receiptId);
            setSingleReceipt(receipt);
        }
    }, [receiptId, receiptsData]);

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: 200,
            // ellipsis: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: 200,
        },
        {
            title: '',
            dataIndex: 'view',
            key: 'view',
            render: (text, record) => (
                <Button onClick={() => null}>Delete</Button>
            ),
        },
    ];

    return (
        <>
            <Modal
                open={open}
                title="Add receipt"
                onCancel={handleCancel}
                centered
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Close
                    </Button>,
                ]}
            >
                <div style={{maxWidth: '600px', width: '100%', margin: '0 auto'}}>
                    <div style={{backgroundColor: '#fafafa', borderRadius: '4px'}}>
                        <Table
                            dataSource={singleReceipt.inputRecipeList ? singleReceipt.inputRecipeList : []}
                            columns={columns}
                            rowKey='id'
                        />
                    </div>
                    <div>Total price: {singleReceipt.inputRecipeList ? singleReceipt.inputRecipeList.reduce((acc, item) => acc + Number(item.price), 0) : ''}</div>
                </div>
            </Modal>
        </>
    );
});

export default ModalViewReceipt;