import * as React from 'react';
import { Button, DialogContainer, Snackbar, Tab, Tabs, TabsContainer, Toolbar } from 'react-md';
import { CreateStop } from './CreateStop';
import { CreateRoute } from './CreateRoute';

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
    toasts: Array<ToastMessage>
}

export class AdminTools extends React.Component<AdminToolsProps, AdminToolsState> {

    public constructor(props: AdminToolsProps) {
        super(props);
        this.state = {
            isShowingDialog: false,
            toasts: new Array<ToastMessage>()
        }
    }

    public componentWillReceiveProps(nextProps: AdminToolsProps) {

        if (nextProps.showDialog != this.state.isShowingDialog) {
            this.setState({ isShowingDialog: nextProps.showDialog });
        }
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
                    <TabsContainer panelClassName={'md-grid'} className={'tabs__page-layout'} colored fixed themed label activeTabIndex={1}
                        toolbar={<Toolbar title={'Administrator Tools'} actions={[<Button flat onClick={() => this.props.onDialogClosed()}>Exit</Button>]} />}
                    >
                        <Tabs tabId='tabs-object' >
                            <Tab label={'Create Stop'} id={'create-stop-tab'}>
                                <CreateStop showToastCallback={this.showToastMessage}/>
                            </Tab>
                            <Tab label={'Create Route'} id={'create-route-tab'}>
                                <CreateRoute showToastCallback={this.showToastMessage}/>
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
}