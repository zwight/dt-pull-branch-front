import { useState } from "react";
import { Button, Form, Input, message, Select, Switch } from "antd";

import api from "../../api";
import './index.scss';
const PUBLIC_PATH = '/opt/git/';
export default function Home() {
    const projectObj = window.APP_CONF.PROJECT_LIST;
    const initialValues = {
        isTag: false,
        isFront: false,
    };
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [projectList, setProjectList] = useState((initialValues.isFront ? projectObj.front : projectObj.service) || []);
    const onFinish = (values: any) => {
        values.projects = values.projects.join(',');
        values.path = PUBLIC_PATH + values.path;
        setLoading(true);

        api.pullBranch(values).then(res => {
            if (res.code === 1) {
                message.success('分支拉取成功');
            } else {
                message.error(res.message);
            }
        }).catch(error => {
            message.error(error);
        }).finally(() => {
            setLoading(false);
        });
    };

    return (<Form className="form-item-container" layout="vertical" form={form} initialValues={initialValues} onFinish={onFinish}>
        <Form.Item label="前端项目" name="isFront" valuePropName="checked" rules={[{ required: true, message: '请选择是否为前端项目' }]}>
            <Switch onChange={(checked) => {
                setProjectList(checked ? projectObj.front : projectObj.service);
            }}
            />
        </Form.Item>
        <Form.Item dependencies={['isFront']} label="项目" name="projects" rules={[{ required: true, message: '请选择项目' }]}>
            <Select mode="multiple" placeholder="请选择项目">
                {projectList.map(d => (<Select.Option key={d} value={d}>
                    {d}
                </Select.Option>))}
            </Select>
        </Form.Item>
        <Form.Item label="服务器路径" name="path" rules={[{ required: true, message: '请输入服务器路径' }]}>
            <Input addonBefore={PUBLIC_PATH} placeholder="请输入服务器路径" />
        </Form.Item>
        <Form.Item label="TAG" name="isTag" valuePropName="checked" rules={[{ required: true, message: '请选择分支是否为TAG' }]}>
            <Switch />
        </Form.Item>

        <Form.Item label="源端分支" name="branchName" rules={[{ required: true, message: '请输入源端分支名' }]}>
            <Input placeholder="请输入源端分支名" />
        </Form.Item>
        <Form.Item label="目标分支" name="newBranchName" rules={[{ required: true, message: '请输入目标端分支名' }]}>
            <Input placeholder="请输入目标端分支名" />
        </Form.Item>
        <Form.Item style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit" loading={loading}>
                提交
            </Button>
        </Form.Item>
    </Form>);
}