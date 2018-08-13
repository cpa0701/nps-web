import Http from '../../common/Http';

class QuestionApplicationService {
    //获取题库
    getQuestionList = async (param) => {
        var url = 'mock/questionMgr/getQuestionLIst';
        return await Http.get(url, param);
    }
}

export default new QuestionApplicationService();
