import React from 'react';
import PropTypes from 'prop-types';
import { PanelHeader, List, Cell, Group, Tabs, TabsItem } from '@vkontakte/vkui';
import Icon24Work from '@vkontakte/icons/dist/24/work';

import { getTasks } from '../api/snek';

export default class Tasks extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: [],
            filter: null
        };
        this.onTaskClick = this.onTaskClick.bind(this);
    }

    static propTypes = {
        currentUser: PropTypes.object.isRequired,
        accessToken: PropTypes.string.isRequired,
        // onMatchSelect: PropTypes.func.isrequired
    }

    componentWillMount() {
        this.fetchTasks();
    }

    componentWillUnmount() {
    }

    async fetchTasks() {
        const tasks = await getTasks();
        this.setState({ tasks });
    }

    onTaskClick(e) {
        // this.props.onMatchSelect(
        //     this.state.matches.find(({id}) => id === Number(e.currentTarget.dataset.matchId)),
        //     this.state.usersById[Number(e.currentTarget.dataset.userId)]
        // );
    }

    render() {
        const tasks = this.state.filter
            ? this.state.tasks.filter(({type}) => type === this.state.filter)
            : this.state.tasks;

        return (
            <React.Fragment>
                <PanelHeader>Задачи</PanelHeader>
                <Group style={{ margin: 0 }}>
                    <Tabs theme="light">
                        <TabsItem
                            onClick={() => this.setState({ filter: null })}
                            selected={!this.state.filter}>
                            Все
                        </TabsItem>
                        <TabsItem
                            onClick={() => this.setState({ filter: 'Контакт с животным' })}
                            selected={this.state.filter === 'Контакт с животным'}>
                            Контакт с животным
                        </TabsItem>
                        <TabsItem
                            onClick={() => this.setState({ filter: 'На авто' })}
                            selected={this.state.filter === 'На авто'}>
                            На авто
                        </TabsItem>
                    </Tabs>
                </Group>
                <List>
                    {tasks.map((task) => {
                        return (
                            <Cell
                                key={task.id}
                                before={
                                    <Icon24Work />
                                }
                                description={task.description}
                                onClick={this.onTaskClick}>
                                {task.title}
                            </Cell>
                        );
                    })}
                </List>
            </React.Fragment>
        );
    }
}
