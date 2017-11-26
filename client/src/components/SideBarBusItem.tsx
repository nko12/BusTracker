import * as React from 'react';
import {Checkbox, FontIcon} from 'react-md';

const favorite = <FontIcon>star</FontIcon>;
const unfavorite = <FontIcon>star_border</FontIcon>;

export interface SideBarBusItemProps {
    itemText: string,
    isFavorited: boolean
}

export class SideBarBusItem extends React.Component<SideBarBusItemProps, {}> {

    render(): void {
        <span>{this.props.itemText}</span>
        <Checkbox 
            checked
        />
    }
}