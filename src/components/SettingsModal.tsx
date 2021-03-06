import { Avatar, Button, Input, List as AntdList, message as Message, Modal, Select } from 'antd'
import { List, Map } from 'immutable'
import React, { Component } from 'react'
import { FormattedMessage, InjectedIntlProps, injectIntl, intlShape } from 'react-intl'
import InterfaceFeed from '../schemas/InterfaceFeed'

import '../styles/SettingsModal.less'

interface InterfaceSettingsModalProps {
    feeds: List<InterfaceFeed>
    language: string,
    visible: boolean
    onClose: (e: any) => any
    onLanguageChange: (language: string) => any
    setLanguage: (language: string) => any
    asyncDeleteFeeds: (feedIds: number[]) => any
}

interface InterfaceSettingsModalState {
    needDeleted: any,
}

class SettingsModal extends Component<InterfaceSettingsModalProps & InjectedIntlProps, {}> {
    public static propTypes: React.ValidationMap<any> = {
        intl: intlShape.isRequired,
    }
    public state: InterfaceSettingsModalState
    public constructor(props: any) {
        super(props)
        this.state = {
            needDeleted: {},
        }
    }
    public handleCancel = (e: any) => {
        this.props.onClose(e)
    }
    public handleOk = (e: any) => {
        const needDeleted = this.state.needDeleted
        const ids: number[] = []
        for (const id in needDeleted) {
            if (needDeleted[id]) {
                ids.push(parseInt(id, 10))
            }
        }
        if (ids.length) {
            this.props.asyncDeleteFeeds(ids)
        }
        this.props.onClose(e)
    }
    public handleDeleteClick = (feedId: number) => {
        const needDeleted = this.state.needDeleted
        needDeleted[feedId] = true
        this.setState({
            needDeleted: { ...needDeleted },
        })
    }
    public handleLanguageChange = (value: string) => {
        this.props.setLanguage(value)
        this.props.onLanguageChange(value)
    }
    public componentWillReceiveProps (props: any) {
        if (props.visible === true) {
            this.setState({
                needDeleted: {},
            })
        }
    }
    public render() {
        return (
            <Modal className="settings-modal"
                title={<FormattedMessage id="settings" />}
                width={512}
                style={{ top: 42 }}
                visible={this.props.visible}
                onCancel={this.handleCancel}
                onOk={this.handleOk}
            >
                <div className="settings-content">
                    <div className="languages-setting">
                        <p><FormattedMessage id="languages" /></p>
                        <Select defaultValue={this.props.language} style={{ width: '100%' }} onChange={this.handleLanguageChange}>
                            <Select.Option value="en-US">en-US</Select.Option>
                            <Select.Option value="zh-CN">zh-CN</Select.Option>
                        </Select>
                    </div>
                    <div className="feeds-setting">
                        <p><FormattedMessage id="feeds" /></p>
                        <AntdList
                            bordered
                            split
                            size="small"
                            itemLayout="horizontal"
                            dataSource={this.props.feeds}
                            renderItem={(feed: InterfaceFeed) => {
                                if (feed.id && this.state.needDeleted[feed.id]) {
                                    return <div />
                                }
                                return (<AntdList.Item className="settings-feed-item"
                                    key={feed.id}
                                    actions={[
                                        (<Button size="small" type="danger" onClick={() => this.handleDeleteClick(feed.id as number)}
                                        ><FormattedMessage id="delete" /></Button>),
                                    ]}
                                >
                                    <p><Avatar shape="square" size={16} src={feed.favicon} /> {feed.title}</p>
                                </AntdList.Item>)
                            }}
                        />
                    </div>
                </div>
            </Modal>
        )
    }
}

export default injectIntl(SettingsModal)
