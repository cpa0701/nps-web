
class CheckRule {
	//正则校验
	pat = {
		patNumber:/^[1-9]\d*$/,  //首个不能为0的纯数字
		patOne:/^[0-9A-Za-z_]+$/,//字母数字和下划线
		passWord:/^[0-9a-zA-Z]{8,16}$/,//密码校验

	}

	//自定义json校验方法
	handleIsJson = (rule,values,callback) => {
		let flag = this.isJSON(values);
		if(!flag){
			callback("请输入json对象格式");
		}else{
			callback();
		}
	}

	//判断json格式
	isJSON = (str) => {
		if (typeof str === 'string') {
	        try {
	        	if (typeof JSON.parse(str) === "object") {
	                return true;
	            }
	        } catch(e) {
	            console.log(e);
	            return false;
	        }
	    }
	}

	//平台账号密码校验
	handlePassWordCheck = (rule,value,callback) => {
		if(!value) {
			callback();
			return;
		}
		let result = this.passWordCheck(value);
		if(result.flag){
			callback();
		}else{
			callback(result.text);
		}

	}
	//密码复杂校验
	passWordCheck = (value) => {
		var result = {
			flag:false,
			text:''
		}
		//大于八位
		if(value.length < 8){
			result = {
				flag: false,
				text:'不能小于八位'
			}
			return result;
		}
		// 密码复杂性要求至少包含以下4种类别中的2种：大写字母、小写字母、数字、特殊符号
		let isUpFlage=0;
        let isLowFlage=0;
        let isNumFlage=0;
        let isOtherFlage=0;
        let otherChar=['!','@','#','$','%','^','&','*','(',')','-','+','+','=','|'];
        for(let i=0;i<value.length;i++){
            let c = value.charAt(i);
            if(c>='A'&&c<='Z'){
                isUpFlage=1;
            }
            if(c>='a'&&c<='z'){
                isLowFlage=1;
            }
            if(c>='0'&&c<='9'){
                isNumFlage=1;
            }
            for(let j=0;j<otherChar.length;j++){
                if(otherChar[j]===value.charAt(i)){
                    isOtherFlage=1;
                }
            }
        }
        var passwordRule = [isUpFlage,isLowFlage,isNumFlage,isOtherFlage];
        for(let i = 0 ; i < passwordRule.length - 1; i++){
        	if(passwordRule[i]*passwordRule[i+1]){
        		result = {
					flag: true,
					text:''
				}
        		return result;
        	}else{
        		result = {
					flag: false,
					text:'至少包含以下4种类别中的2种：大写字母、小写字母、数字、特殊符号'
				}
        	}
        }
		return result;
	}



}
export default new CheckRule();
