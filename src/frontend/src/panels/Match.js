import React from 'react';
import PropTypes from 'prop-types';

import { PanelHeader, Group, Div, Avatar, Cell, Button, platform, IOS, HeaderButton, CellButton } from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import './Match.css';

const osname = platform();

export default class Matches extends React.Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
        onClose: PropTypes.func.isRequired
    }

    render() {
        const { match, user } = this.props;
        return (
            <React.Fragment>
                <PanelHeader
                    left={
                        <HeaderButton onClick={() => this.props.onClose()}>
                            {osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
                        </HeaderButton>
                    }>
                    Пара
                </PanelHeader>

                <div className="match-hero">
                    <div className="match-image" style={{
                        backgroundImage: `url('${match.photo}')`
                    }} />
                    <h2 className="match-name">{match.name}</h2>
                </div>

                <Group>
                    <Div>{match.description}</Div>
                </Group>

                <Group title="На карте">
                    <div className="match-map"></div>
                    <Cell>
                        <Button size="xl" level="secondary">Проложить маршрут</Button>
                    </Cell>
                </Group>

                <Group title="Вы идете с">
                    <Cell
                        before={
                            <Avatar src={user.photo_100} />
                        }>
                        {`${user.first_name} ${user.last_name}`}
                    </Cell>
                    <Cell>
                        <Button
                            size="xl"
                            level="primary"
                            component="a"
                            href={`https://vk.me/id${user.id}`}>
                            Написать сообщение
                        </Button>
                    </Cell>
                </Group>

                <Group title="Действия">
                    <CellButton level="danger">Отменить встречу</CellButton>
                </Group>
            </React.Fragment>
        );
    }
}
