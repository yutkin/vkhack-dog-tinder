import React from 'react';
import PropTypes from 'prop-types';

import { PanelHeader, Group, Div, InfoRow, Avatar, Cell, Button, platform, IOS, HeaderButton, CellButton } from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import { Map, Placemark } from 'react-yandex-maps';

import { takeTask } from '../api/snek';

import './Task.css';

import connect from '@vkontakte/vkui-connect';
// import connect from '@vkontakte/vkui-connect-mock';

const osname = platform();

export default class Task extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            taken: this.props.task.persons_applied.includes(
                String(this.props.currentUser.id)
            ),
            taskContactUser: null
        };
        this.onTakeTask = this.onTakeTask.bind(this);
        // this.handleConnectEvent = this.handleConnectEvent.bind(this);
    }

    static propTypes = {
        task: PropTypes.object.isRequired,
        currentUser: PropTypes.object.isRequired,
        onClose: PropTypes.func.isRequired,
        onComplete: PropTypes.func.isRequired,
        onDiscard: PropTypes.func.isRequired,
        accessToken: PropTypes.string.isRequired,
    }

    // componentWillMount() {
    //     connect.subscribe(this.handleConnectEvent);
    //     connect.send('VKWebAppCallAPIMethod', {
    //         'method': 'users.get',
    //         'params': {
    //             'user_ids': [this.props.task.owner],
    //             'fields': 'photo_100',
    //             'v': '5.87',
    //             'access_token': this.props.accessToken
    //         }
    //     });
    // }

    // componentWillUnmount() {
    //     connect.unsubscribe(this.handleConnectEvent);
    // }

    // handleConnectEvent(e) {
    //     if (e.detail.type === 'VKWebAppCallAPIMethodResult') {
    //         this.setState({
    //             taskContactUser: e.detail.data.response[0]
    //         })
    //     }
    // }

    async onTakeTask() {
        this.setState({ taken: true });

        await takeTask(this.props.task.id, this.props.currentUser.id);
    }

    render() {
        const { task, currentUser } = this.props;

        // const {taskContactUser} = this.state;
        return (
            <React.Fragment>
                <PanelHeader
                    left={
                        <HeaderButton onClick={() => this.props.onClose()}>
                            {osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
                        </HeaderButton>
                    }>
                    Задача
                </PanelHeader>

                <Group>
                    <Div>{task.title}</Div>
                    <Div>
                        <InfoRow title="Описание">
                            {task.description}
                        </InfoRow>
                    </Div>
                </Group>

                {/* <Group title="Ответственный">
                    <Cell
                        before={
                            <Avatar src={taskContactUser.photo_100} />
                        }>
                        {`${taskContactUser.first_name} ${taskContactUser.last_name}`}
                    </Cell>
                    <Cell>
                        <Button
                            size="xl"
                            level="primary"
                            component="a"
                            href={`https://vk.me/id${taskContactUser.id}`}>
                            Написать сообщение
                        </Button>
                    </Cell>
                </Group> */}

                <Group>
                    <div className="match-map">
                        <Map
                            defaultState={{ center: [task.lat, task.lon], zoom: 12 }}
                            width="100%"
                            height={300}
                        >
                            <Placemark geometry={[task.lat, task.lon]} />
                        </Map>
                    </div>
                    <Cell>
                        <Button
                            size="xl"
                            level="secondary"
                            component="a"
                            href={`https://yandex.ru/maps/?z=12&ll=${task.lon},${task.lat}&l=map&rtext=~${task.lat},${task.lon}`}
                            target="_blank">
                            Проложить маршрут
                        </Button>
                    </Cell>
                </Group>

                <Group title={this.state.taken ? 'Вы выполняете эту задачу' : 'Действия'}>
                    {!this.state.taken && (
                        <CellButton
                            onClick={this.onTakeTask}>
                            Взять задачу
                        </CellButton>
                    )}
                    
                    {this.state.taken && (
                        <React.Fragment>
                            <CellButton
                                onClick={() => this.props.onComplete()}>
                                Я выполнил задачу
                            </CellButton>
                            <CellButton
                                level="danger"
                                onClick={() => this.props.onDiscard()}>
                                Отказаться от выполнения задачи
                            </CellButton>
                        </React.Fragment>
                    )}
                </Group>
            </React.Fragment>
        );
    }
}
