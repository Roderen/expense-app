import React, {memo, useCallback, useEffect, useState} from 'react';
import dayjs from 'dayjs';
import {Button, Flex, Select, Spin, Table} from 'antd';
import CreateTableDataBtn from '@/app/components/CreateTableDataBtn/CreateTableDataBtn';
import {deleteReceipt, fetchReceipts} from '@/app/services/receiptService';
import {useReceiptsStore} from '@/app/store/store';
import ModalAddReceipt from '@/app/components/ModalAddReceipt/ModalAddReceipt';
import ModalViewReceipt from "@/app/components/ModalViewReceipt/ModalViewReceipt";
import { LoadingOutlined } from '@ant-design/icons';
import {useAuth} from "@/app/context/AuthContext";
import DragAndDropReceipt from "@/app/components/DragAndDropReceipt/DragAndDropReceipt";

// Плагин для парсинга формата даты DD-MM-YY
import 'dayjs/locale/ru';

const ReceiptsTable = memo(() => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const receiptsData = useReceiptsStore((state) => state.receipts);
    const setReceipts = useReceiptsStore((state) => state.setReceipts);
    const {user} = useAuth();

    const [isAddReceiptModalOpen, setIsAddReceiptModalOpen] = useState(false);
    const [isViewReceiptModalOpen, setIsViewReceiptModalOpen] = useState(false);
    const [selectedReceiptId, setSelectedReceiptId] = useState(null);

    const [filterYear, setFilterYear] = useState(null);
    const [filterMonth, setFilterMonth] = useState(null);

    const showModal = useCallback(() => {
        setIsAddReceiptModalOpen(true);
    }, []);

    const handleCancel = useCallback(() => {
        setIsAddReceiptModalOpen(false);
    }, []);

    const showViewModal = useCallback((receiptId) => {
        setSelectedReceiptId(receiptId);
        setIsViewReceiptModalOpen(true);
    }, []);

    const handleCancelViewModal = useCallback(() => {
        setIsViewReceiptModalOpen(false);
        setSelectedReceiptId(null);
    }, []);

    const deleteTableItem = useCallback((receiptId) => {
        void deleteReceipt(receiptId)
        setReceipts(receiptsData.filter((receipt) => receipt.id !== receiptId));
    }, [receiptsData, setReceipts]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const receipts = await fetchReceipts(user.uid);
                setReceipts(receipts);
            } catch (error) {
                setError(error);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [setReceipts, user.uid]);

    if (loading) return (
        <>
            <Flex style={{
                justifyContent: 'center',
            }}>
                <Spin
                    indicator={
                        <LoadingOutlined
                            style={{
                                fontSize: 48,
                            }}
                            spin
                        />
                    }
                />
            </Flex>
        </>
    );
    if (error) return <div>Error: {error.message}</div>;

    // Data filter
    const filterData = (data) => {
        return data.filter(item => {
            const date = dayjs(item.date, 'DD-MM-YY', true);
            return date.isValid() &&
                (filterYear ? date.year() === filterYear : true) &&
                (filterMonth ? date.month() === filterMonth - 1 : true);
        });
    };
    

    const filteredData = filterData(receiptsData);

    const columns = [
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: 300,
            ellipsis: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: 200,
            render: (text) => <span style={{fontWeight: 'bold', color: 'red'}}>{text}</span>,
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: 200,
            render: (text) => dayjs(text, 'DD-MM-YY').format('DD-MM-YY'),
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
            filterDropdown: ({
                                 clearFilters,
                             }) => (
                <Flex style={{padding: '10px 20px', flexDirection: 'column', alignItems: 'center'}}>
                    <Select
                        defaultValue=""
                        style={{width: 120, marginBottom: 8}}
                        onChange={(value) => setFilterYear(value)}
                    >
                        <Select.Option value="">Select Year</Select.Option>
                        {Array.from(new Set(receiptsData.map(item => dayjs(item.date, 'DD-MM-YY').year())))
                            .map(year => <Select.Option key={year} value={year}>{year}</Select.Option>)}
                    </Select>
                    <Select
                        defaultValue=""
                        style={{width: 120}}
                        onChange={(value) => setFilterMonth(value)}
                    >
                        <Select.Option value="">Select Month</Select.Option>
                        {Array.from({length: 12}, (_, i) => i + 1)
                            .map(month => <Select.Option key={month}
                                                         value={month}>{dayjs().month(month - 1).format('MMMM')}</Select.Option>)}
                    </Select>
                    <Button
                        onClick={() => {
                            clearFilters();
                            setFilterYear(null);
                            setFilterMonth(null);
                        }}
                        style={{marginTop: 8}}
                    >
                        Reset
                    </Button>
                </Flex>
            )
        },
        {
            title: '',
            dataIndex: 'view',
            key: 'view',
            render: (_, record) => {
                return <Button onClick={() => showViewModal(record.id)}>View</Button>;
            },
            align: 'right',
        },
        {
            title: '',
            dataIndex: 'delete',
            key: 'delete',
            render: (_, record) => {
                return <Button onClick={async () => {
                    await deleteTableItem(record.id)
                }}>Delete</Button>;
            },
            align: 'right',
        },
    ];

    return (
        <>
            <ModalAddReceipt open={isAddReceiptModalOpen} handleCancel={handleCancel}/>
            <ModalViewReceipt
                open={isViewReceiptModalOpen}
                handleCancel={handleCancelViewModal}
                receiptId={selectedReceiptId}
            />

            <div style={{maxWidth: '1200px', width: '100%', margin: '0 auto'}}>
                <Flex style={{justifyContent: 'space-between'}}>
                    <CreateTableDataBtn marginBottom="10px" type="primary" onClick={showModal}/>
                    {/*<div style={{maxWidth: "300px", width: "100%", marginBottom: "10px"}}><DragAndDropReceipt/></div>*/}
                    <div style={{
                        padding: "4px 15px",
                        borderRadius: "6px",
                        fontWeight: "bold",
                        backgroundColor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                    }}>Total: <span
                        style={{color: "red"}}>
                        {filteredData ? (
                            (() => {
                                const total = filteredData.reduce((acc, item) => acc + Number(item.price), 0);
                                return Number(total).toFixed(2);
                            })()
                        ) : '0'}
                    </span>
                    </div>
                </Flex>
                <div style={{backgroundColor: '#fafafa', borderRadius: '4px'}}>
                    <Table
                        pagination={{
                            pageSize: 10,
                        }}
                        dataSource={filteredData}
                        columns={columns}
                        rowKey="id"
                        scroll={{ x: "max-content" }}
                    />
                </div>
            </div>
        </>
    );
});

export default ReceiptsTable;
