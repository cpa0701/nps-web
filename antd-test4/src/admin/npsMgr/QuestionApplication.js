import React from 'react';
import QuestionApplicationService from "../../services/question/QuestionApplicationService"
import {Radio, Checkbox, Row, Col, Input} from "antd"

const RadioGroup = Radio.Group;


class QuestionApplication extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            questionList: [],
            questionDisplayList: [],
            questionDisplayList1: [],
            value: ''
        }
    }

    componentWillMount() {
        QuestionApplicationService.getQuestionList().then(result => {
            if (result) {
                const QuestionType = ({type}) => {
                    return this.QuestionType(type)
                }
                const questionList = result.result.map(question => {
                    return <QuestionType type={question.type} key={question.id}/>
                })
                this.setState({
                    questionList: questionList
                })
            }
        });
    }

    QuestionType = (type) => {
        switch (type) {
            case 'radio':
                return (<div onClick={this.getDom.bind(this, 'radio')}>
                    <RadioGroup>
                        <Radio value={1}>A</Radio>
                        <Radio value={2}>B</Radio>
                        <Radio value={3}>C</Radio>
                        <Radio value={4}>D</Radio>
                    </RadioGroup>
                </div>);
            case 'checkbox':
                return (
                    <div onClick={this.getDom.bind(this, 'checkbox')}><Checkbox.Group
                        style={{width: '100%'}}>
                        <Row>
                            <Col span={8}><Checkbox value="A">A</Checkbox></Col>
                            <Col span={8}><Checkbox value="B">B</Checkbox></Col>
                            <Col span={8}><Checkbox value="C">C</Checkbox></Col>
                            <Col span={8}><Checkbox value="D">D</Checkbox></Col>
                            <Col span={8}><Checkbox value="E">E</Checkbox></Col>
                        </Row>
                    </Checkbox.Group>
                    </div>);
            case 'blank':
                return (<div onClick={this.getDom.bind(this, 'blank')}>
                    <Input placeholder="Basic usage"/>
                </div>)
        }
    }

    getDom = (type) => {
        this.state.questionDisplayList1.push(type);
        this.setState({questionDisplayList: [...this.state.questionDisplayList1]})
    }

    render() {
        const questionDisplayList = this.state.questionDisplayList1.map((item, i) => {
            return this.QuestionType(item);
        });
        return (
            <div>
                <Row>
                    <Col style={{height: "500px", overflow: "auto"}} span={8}>{this.state.questionList}</Col>
                    <Col span={16}>{questionDisplayList}</Col>
                </Row>
            </div>
        )
    }
}

export default QuestionApplication;
