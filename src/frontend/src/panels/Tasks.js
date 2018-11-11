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
        onTaskSelect: PropTypes.func.isrequired
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
        this.props.onTaskSelect(
            this.state.tasks.find(({id}) => id === Number(e.currentTarget.dataset.taskId))
        );
    }

    render() {
        let tasks = this.state.filter
            ? this.state.tasks.filter(({type}) => type === this.state.filter)
            : this.state.tasks;

        const takenTasks = tasks.filter(({persons_applied: personsApplied}) => (
            personsApplied.includes(String(this.props.currentUser.id))
        ));

        const otherTasks = tasks.filter(({persons_applied: personsApplied}) => (
            !personsApplied.includes(String(this.props.currentUser.id))
        ));

        const takenTasksList = (
            <List>
                {takenTasks.map((task) => {
                    return (
                        <Cell
                            key={task.id}
                            before={<Icon24Work />}
                            description={task.description}
                            onClick={this.onTaskClick}
                            data-task-id={task.id}>
                            {task.title}
                        </Cell>
                    );
                })}
            </List>
        );

        const otherTasksList = (
            <List>
                {otherTasks.map((task) => {
                    return (
                        <Cell
                            key={task.id}
                            before={<Icon24Work />}
                            description={task.description}
                            onClick={this.onTaskClick}
                            data-task-id={task.id}>
                            {task.title}
                        </Cell>
                    );
                })}
            </List>
        );

        return (
            <React.Fragment>
                <PanelHeader>Задачи</PanelHeader>
                <Group style={{ marginTop: 0, marginBottom: takenTasks.length ? 'inherit' : 0 }}>
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

                {Boolean(takenTasks.length) && Boolean(otherTasks.length) && (
                    <React.Fragment>
                        <Group title="Мои задачи">
                            {takenTasksList}
                        </Group>
                        <Group title="Все задачи">
                            {otherTasksList}
                        </Group>
                    </React.Fragment>
                )}

                {Boolean(takenTasks.length) && !Boolean(otherTasks.length) && (
                    <Group title="Мои задачи">
                        {takenTasksList}
                    </Group>
                )}

                {!Boolean(takenTasks.length) && Boolean(otherTasks.length) && otherTasksList}
            </React.Fragment>
        );
    }
}
