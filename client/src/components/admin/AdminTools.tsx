import * as React from 'react';
import { Button, DialogContainer, Snackbar, Tab, Tabs, TabsContainer, Toolbar } from 'react-md';
import { CreateStop, CreateRoute, ToggleUserAdmin } from './';

interface ToastMessage {
    text: string
}

export interface AdminViewProps {
    showToastCallback(message: string): void;
}

export interface AdminToolsProps {
    showDialog: boolean;
    onDialogClosed(): void;
    selectedTabIndex: number
}

interface AdminToolsState {  
    isShowingDialog: boolean;
    toasts: Array<ToastMessage>;
    selectedTabIndex: number;
}

export class AdminTools extends React.Component<AdminToolsProps, AdminToolsState> {

    public constructor(props: AdminToolsProps) {
        super(props);
        this.state = {
            isShowingDialog: false,
            toasts: new Array<ToastMessage>(),
            selectedTabIndex: props.selectedTabIndex
        }
    }

    public componentWillReceiveProps(nextProps: AdminToolsProps) {

        if (nextProps.showDialog != this.state.isShowingDialog) {
            this.setState({ isShowingDialog: nextProps.showDialog });
        }

        this.setState({ selectedTabIndex: nextProps.selectedTabIndex});
    }

    public showToastMessage = (message: string): void => {

        const toasts = this.state.toasts.slice();
        toasts.push({ text: message });
        this.setState({ toasts });
    }

    public render(): React.ReactNode {
        return (
            <div>
                <DialogContainer
                    id={'admin-tools-dialog'}
                    visible={this.state.isShowingDialog}
                    onHide={this.props.onDialogClosed}
                    portal={true}
                    fullPage={true}
                >
                    <TabsContainer panelClassName={'md-grid'} className={'tabs__page-layout'} colored fixed themed label activeTabIndex={this.state.selectedTabIndex}
                        toolbar={<Toolbar title={'Administrator Tools'} actions={[<Button flat onClick={() => this.props.onDialogClosed()}>Exit</Button>]} />}
                        onTabChange={this.onTabChanged}
                    >
                        <Tabs tabId='tabs-object'>
                            <Tab label={'About Tools'} id={'admin-tools-info'}>
                                <p>
                                    The tabs in this window allow you, an admin, to make certain changes to the Bus Tracker system that 
                                    will affect all users. These abilities include:
                                    <br></br>
                                    <ul>
                                        <li>Create Bus Stops - Allows you to create fake bus stops. The system uses actual bus data, so these stops
                                            will not display bus data with them.
                                        </li>
                                        <li>Delete Bus Stops - Allows you to delete fake bus stops that you have created. You cannot delete the real
                                            bus stops provided by the BusTime API.
                                        </li>
                                        <li>Create Routes - Allows you to define fake routes. The route will show up to users like real ones.
                                        </li>
                                        <li>Delete Routes - Allows you to delete fake routes. Like the "Delete Stop" tab, you cannot delete the real
                                            bus routes provided by the BusTime API.
                                        </li>
                                        <li>Admin Privileges - Allows you to grant or revoke the admin privileges of another user, given their username.
                                        </li>
                                    </ul>
                                    <br></br>
                                    With these powers comes great responsibility. Use these tools wisely.
                                </p>
                            </Tab>
                            <Tab label={'Create Stop'} id={'create-stop-tab'}>
                                <CreateStop showToastCallback={this.showToastMessage}/>
                            </Tab>
                            <Tab label={'Delete Stop'} id={'delete-stop-tab'}>
                                
                            </Tab>
                            <Tab label={'Create Route'} id={'create-route-tab'}>
                                <CreateRoute showToastCallback={this.showToastMessage}/>
                            </Tab>
                            <Tab label={'Delete Route'} id={'delete-stop-tab'}>

                            </Tab>
                            <Tab label={'Admin Privileges'} id={'toggle-admin-privliges'}>
                                <ToggleUserAdmin showToastCallback={this.showToastMessage}/>
                            </Tab>
                        </Tabs>
                    </TabsContainer>
                    <Snackbar
                        id='admin-tools-info-snackbar'
                        autohide={true}
                        toasts={this.state.toasts}
                        onDismiss={this.onDismissToast}
                        autohideTimeout={3000}
                        portal={true}
                    />
                </DialogContainer>
            </div>
        );
    }

    private onDismissToast = () => {
        const [, ...toasts] = this.state.toasts;
        this.setState({ toasts });
    }

    private onTabChanged = (newActiveTabIndex: number) => {
        this.setState({selectedTabIndex: newActiveTabIndex});
    }
}