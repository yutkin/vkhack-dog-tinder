import React from 'react';
import { View, Epic, Tabbar, TabbarItem, Panel, PanelHeader } from '@vkontakte/vkui';
import Icon28Favorite from '@vkontakte/icons/dist/28/favorite';
import Icon28Place from '@vkontakte/icons/dist/28/place';
import Icon28More from '@vkontakte/icons/dist/28/more';

import Discover from './panels/Discover';

import '@vkontakte/vkui/dist/vkui.css';

class App extends React.Component {
    constructor (props) {
        super(props);
    
        this.state = {
            activeStory: 'discover'
        };
        this.onStoryChange = this.onStoryChange.bind(this);
    }
  
    onStoryChange (e) {
        this.setState({ activeStory: e.currentTarget.dataset.story })
    }

    render () {
        return (
            <Epic activeStory={this.state.activeStory} tabbar={
                <Tabbar>
                    <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'matches'}
                        data-story="matches"
                        label="&nbsp;"
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
                <View id="matches" activePanel="matches">
                    <Panel id="matches">
                        <PanelHeader>Matches</PanelHeader>
                    </Panel>
                </View>
                <View id="discover" activePanel="discover">
                    <Panel id="discover">
                        <Discover />
                    </Panel>
                </View>
                <View id="tasks" activePanel="tasks">
                    <Panel id="tasks">
                        <PanelHeader>Tasks</PanelHeader>
                    </Panel>
                </View>
            </Epic>
        )
    }
}

export default App;
