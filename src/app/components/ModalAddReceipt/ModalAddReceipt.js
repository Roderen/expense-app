import React, {useState, useCallback, memo} from 'react';
import {Button, DatePicker, Form, Input, Modal} from 'antd';
import {v4 as uuidv4} from 'uuid';
import dayjs from "dayjs";
import {createRecipe} from "@/app/services/receiptService";
import {useAuth} from "@/app/context/AuthContext";
import {useReceiptsStore} from "@/app/store/store";

const ModalAddReceipt = memo(({open, handleCancel}) => {
    const [form] = Form.useForm();
    const [inputRecipeList, setInputRecipeList] = useState([]);
    const receiptsData = useReceiptsStore((state) => state.receipts);
    const setReceipts = useReceiptsStore((state) => state.setReceipts);
    const {user} = useAuth();

    const onFinish = async (values) => {
        const {titleReceiptItem, priceReceiptItem, ...filteredValues} = values;
        const date = dayjs(filteredValues.date).format('DD-MM-YY');
        filteredValues.date = date
        filteredValues.id = uuidv4();
        filteredValues.userId = user.uid;
        filteredValues.inputRecipeList = inputRecipeList;

        await createRecipe(filteredValues);
        setReceipts([...receiptsData, filteredValues]);
        handleCancel();
        form.resetFields();
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const deleteReceiptListItem = (e, index) => {
        setInputRecipeList((prevRecipeList) => prevRecipeList.filter((_, i) => i !== index));
    }

    const handleChangeNumber = useCallback((event) => {
        event.target.value = event.target.value.replace(',', '.');
    }, []);

    const addReceiptItem = useCallback(() => {
        const title = form.getFieldValue('titleReceiptItem');
        const price = form.getFieldValue('priceReceiptItem');

        // Регулярное выражение для проверки формата цены (десятичное число с двумя знаками после запятой)
        const pricePattern = /^\d+(\.\d{1,2})?$/;

        // Проверка наличия title и соответствия цены регулярному выражению
        if (!title) {
            console.error('Title is required');
            form.setFields([
                {
                    name: 'titleReceiptItem',
                    errors: ['Title is required'],
                },
            ]);
            return;
        }

        if (!pricePattern.test(price)) {
            console.error('Invalid price format');
            form.setFields([
                {
                    name: 'priceReceiptItem',
                    errors: ['Invalid price format. Please input in format 10.99 or 10,99'],
                },
            ]);
            return;
        }

        // Если все проверки пройдены, добавляем элемент в список и сбрасываем поля
        setInputRecipeList((prevList) => [
            ...prevList,
            {
                title,
                price,
            },
        ]);

        form.resetFields(['titleReceiptItem', 'priceReceiptItem']);
    }, [form]);

    return (
        <Modal
            open={open}
            title="Add receipt"
            onCancel={handleCancel}
            centered
            style={{maxWidth: '500px'}}
            footer={[]}
        >
            <Form
                form={form}
                name="basic"
                layout="vertical"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                style={{maxWidth: 600}}
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Category:"
                    name="category"
                    rules={[{required: false}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Price:"
                    name="price"
                    rules={[
                        {
                            required: true,
                            message: 'Please input in format 10.99 or 10,99',
                            pattern: /^\d+(\.\d{1,2})?$/
                        }
                    ]}
                >
                    <Input onChange={handleChangeNumber}/>
                </Form.Item>

                <Form.Item
                    label="Date:"
                    name="date"
                    rules={[{required: true, message: "Please choose date"}]}
                >
                    <DatePicker defaultValue={dayjs()} format="DD-MM-YY" />
                </Form.Item>

                <Form.Item style={{marginBottom: '7px'}}>
                    <label className="ant-form-item-required">Receipt items:</label>
                </Form.Item>

                <div style={{flexDirection: 'column', marginLeft: '10px'}}>
                    <Form.Item
                        style={{marginBottom: '7px'}}
                        label="Title item:"
                        name="titleReceiptItem"
                        rules={[
                            {
                                required: false,
                            }
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        style={{marginBottom: '7px'}}
                        label="Price item:"
                        name="priceReceiptItem"
                        rules={[
                            {
                                required: false,
                            }
                        ]}
                    >
                        <Input onChange={handleChangeNumber}/>
                    </Form.Item>

                    <Button type="primary" onClick={addReceiptItem} style={{width: 'fit-content'}}>
                        Add
                    </Button>
                </div>

                {inputRecipeList.length ? (
                    <div style={{
                        border: '1px solid #d9d9d9',
                        padding: '7px 10px',
                        width: '200px',
                        margin: '10px 0 20px',
                    }}>
                        {inputRecipeList.map((item, index) => (
                            <div className="receiptListItem" data-id={index} key={index} style={{display: 'flex', alignItems: 'center'}}>
                                <div>{item.title} - {item.price}</div>
                                <span style={{marginLeft: '5px', color: 'red', fontWeight: 'bold', cursor: 'pointer'}}
                                      onClick={e => deleteReceiptListItem(e, index)}>x</span>
                            </div>
                        ))}
                    </div>
                ) : ''}

                <Form.Item
                    style={{display: 'flex', justifyContent: 'flex-end', margin: '15px 0 0'}}
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
});

export default ModalAddReceipt;
