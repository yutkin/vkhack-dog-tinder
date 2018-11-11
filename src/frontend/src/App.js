import React from 'react';
import { View, Epic, Tabbar, TabbarItem, Panel, PanelHeader, platform, IOS, ActionSheet, ActionSheetItem, Alert } from '@vkontakte/vkui';
import Icon28Favorite from '@vkontakte/icons/dist/28/favorite';
import Icon28Place from '@vkontakte/icons/dist/28/place';
import Icon28More from '@vkontakte/icons/dist/28/more';
import connect from '@vkontakte/vkui-connect';
// import connect from '@vkontakte/vkui-connect-mock';

import Discover from './panels/Discover';
import Matches from './panels/Matches';
import Match from './panels/Match';
import Tasks from './panels/Tasks';
import Task from './panels/Task';

import { discardMatch } from './api/snek';

import '@vkontakte/vkui/dist/vkui.css';

const osname = platform();

const APP_ID = 6746937;
const defaultUserId = 23878107;

class App extends React.Component {
    constructor (props) {
        super(props);
    
        this.state = {
            activeStory: 'discover',
            currentUser: null,
            accessToken: null,
            activeMatch: null,
            geoData: null,
            showDiscardMatchPopout: false,

            activeTask: null,
            showDiscardTaskPopout: false
        };
        this.handleConnectEvent = this.handleConnectEvent.bind(this);
        this.onStoryChange = this.onStoryChange.bind(this);
        this.openMatchPanel = this.openMatchPanel.bind(this);
        this.closeMatchPanel = this.closeMatchPanel.bind(this);
        this.showDiscardMatchPopuot = this.showDiscardMatchPopuot.bind(this);

        this.openTaskPanel = this.openTaskPanel.bind(this);
        this.closeTaskPanel = this.closeTaskPanel.bind(this);
        this.showDiscardTaskPopuot = this.showDiscardTaskPopuot.bind(this);
        this.showCompleteTaskPopout = this.showCompleteTaskPopout.bind(this);
    }

    componentDidMount() {
        connect.subscribe(this.handleConnectEvent);
        connect.send('VKWebAppGetUserInfo', {});
        connect.send('VKWebAppGetAuthToken', {'app_id': APP_ID, 'scope': 'notify'});
        connect.send("VKWebAppGetGeodata", {});
    }

    handleConnectEvent(e) {
        if (e.detail.type === 'VKWebAppGetUserInfoResult') {
            if (!e.detail.data.id) {
                e.detail.data.id = defaultUserId;
            }
            this.setState({ currentUser: e.detail.data });
        } else if (e.detail.type === 'VKWebAppAccessTokenReceived') {
            this.setState({ accessToken: e.detail.data.access_token });
        } else if (e.detail.type === 'VKWebAppGeodataResult') {
            this.setState({ geoData: e.detail.data });
        }
    }
  
    onStoryChange(e) {
        this.setState({ activeStory: e.currentTarget.dataset.story, activeMatch: null, activeTask: null })
    }

    openMatchPanel(match, user) {
        this.setState({ activeMatch: { match, user } });
    }

    closeMatchPanel() {
        this.setState({ activeMatch: null });
    }

    showDiscardMatchPopuot() {
        this.setState({ showDiscardMatchPopout: true });
    }

    async discardMatch() {
        await discardMatch(this.state.activeMatch.match.id, this.state.currentUser.id);
        this.closeMatchPanel();
    }

    openTaskPanel(activeTask) {
        this.setState({ activeTask });
    }

    closeTaskPanel() {
        this.setState({ activeTask: null });
    }

    showDiscardTaskPopuot() {
        this.setState({ showDiscardTaskPopout: true });
    }

    async discardTask() {
        this.closeTaskPanel();
    }

    showCompleteTaskPopout() {
        this.setState({ showCompleteTaskPopout: true });
    }

    render () {
        if (!this.state.currentUser || !this.state.accessToken) return null; // must be a spinner

        const discardMatchPopout = this.state.showDiscardMatchPopout ? (
            <ActionSheet
                onClose={() => this.setState({ showDiscardMatchPopout: false })}
                title="Отказаться от встречи?"
            >
                <ActionSheetItem
                    autoclose
                    theme="destructive"
                    onClick={() => this.discardMatch()}>Отказаться</ActionSheetItem>
                {osname === IOS && <ActionSheetItem autoclose theme="cancel">Отмена</ActionSheetItem>}
            </ActionSheet>
        ) : null;

        const discardTaskPopout = this.state.showDiscardTaskPopout ? (
            <ActionSheet
                onClose={() => this.setState({ showDiscardTaskPopout: false })}
                title="Отказаться от выполнения задачи?"
            >
                <ActionSheetItem
                    autoclose
                    theme="destructive"
                    onClick={() => this.discardTask()}>Отказаться</ActionSheetItem>
                {osname === IOS && <ActionSheetItem autoclose theme="cancel">Отмена</ActionSheetItem>}
            </ActionSheet>
        ) : null;

        const completeTaskPopout = this.state.showCompleteTaskPopout ? (
            <Alert
                actions={[{
                    title: 'OK',
                    autoclose: true,
                    // style: 'destructive'
                }]}
                onClose={() => this.setState({ showCompleteTaskPopout: false })}
            >
                <h2>Ошибка</h2>
                <p>Вы должны находиться в зоне завершения задачи</p>
            </Alert>
        ) : null;

        const tasksViewPopout = discardTaskPopout || completeTaskPopout;

        return (
            <Epic activeStory={this.state.activeStory} tabbar={
                <Tabbar>
                    <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'matches'}
                        data-story="matches"
                        // label="&nbsp;"
                    ><Icon28Favorite /></TabbarItem>
                    <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'discover'}
                        data-story="discover"
                    ><Icon28Place /></TabbarItem>
                    <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'tasks'}
                        data-story="tasks"
                    ><Icon28More /></TabbarItem>
                </Tabbar>
            }>
                <View
                    id="matches"
                    activePanel={this.state.activeMatch ? 'match' : 'matches'}
                    popout={discardMatchPopout}>
                    <Panel id="matches">
                        <Matches
                            currentUser={this.state.currentUser}
                            accessToken={this.state.accessToken}
                            onMatchSelect={this.openMatchPanel}
                        />
                    </Panel>

                    <Panel id="match">
                        {this.state.activeMatch && (
                            <Match
                                match={this.state.activeMatch.match}
                                user={this.state.activeMatch.user}
                                onClose={this.closeMatchPanel}
                                onDiscard={this.showDiscardMatchPopuot}
                            />
                        )}
                    </Panel>
                </View>
                <View id="discover" activePanel="discover">
                    <Panel id="discover">
                        <Discover currentUser={this.state.currentUser} accessToken={this.state.accessToken} />
                    </Panel>
                </View>

                <View
                    id="tasks"
                    activePanel={this.state.activeTask ? 'task' : 'tasks'}
                    popout={tasksViewPopout}>
                    <Panel id="tasks">
                        <Tasks
                            onTaskSelect={this.openTaskPanel}
                            currentUser={this.state.currentUser} />
                    </Panel>

                    <Panel id="task">
                        {this.state.activeTask && (
                            <Task
                                task={this.state.activeTask}
                                currentUser={this.state.currentUser}
                                onClose={this.closeTaskPanel}
                                onComplete={this.showCompleteTaskPopout}
                                onDiscard={this.showDiscardTaskPopuot}
                                accessToken={this.state.accessToken} />
                        )}
                    </Panel>
                </View>
            </Epic>
        )
    }
}

export default App;
