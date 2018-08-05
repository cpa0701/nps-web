import React from 'react';
import {inject} from "mobx-react/index"
import stores from "../../../../../model/Stores"

@inject("stores")
class Domain extends React.Component {
    render() {
        const {test}=this.props.stores.I18nModel.outputLocale
        return (
            <div style={{margin: 20}}>
                {test}
            </div>
        )
    }
}

export default Domain;
