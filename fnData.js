var FnData = (function($){
	if($ !== window.jQuery) { throw Error('Please to reload jQuery'); }

	var fnData = function(opts){
		!opts && (opts = {});

		this.dataName = opts.dataName || 'data-name';		//数据名称		eg: data-name="name"
		this.cut = opts.cut || '-';							//分隔数据字符	eg: data-name="objName-name"
		this.isGetEmpty = !!opts.isGetEmpty || false;		//是否返回空对象和字符
	}

	function fnIsIpt($ele){
		return ['INPUT', 'SELECT', 'TEXTAREA'].indexOf($ele[0].tagName) >= 0;
	}

	function getDoms(yDom, dataName){

		return yDom.find('['+dataName+']').filter(function(){ return !$(this).parents('['+dataName+']').length; });
	}

	function getVal($ele){
		var type = $ele.attr('type');

		var v = null;

		if(fnIsIpt($ele)){

			if(type == 'radio'){
				v = $ele[0].checked ? $ele.val() : '#Not of value#';
			}else if(type == 'checkbox'){
				v = $ele[0].checked;
			}else{
				v = $ele.val();
			}
		}else{

			v = $ele.text();
		}

		return v;
	}

	function getFilter($ele, data){
		var _filter = $ele.data('getfilter');

		if($.isFunction(_filter)){
			data = _filter(data, $ele);
		}

		return data;
	}

	function setObjVal(obj, data, name, cut){

		if(name.indexOf(cut) > 0){
			var ns = name.split(cut);

			var _obj = {};

			_obj[ns[1]] = data;

			obj[ns[0]] ? $.extend(true, rData[ns[0]], _obj) : (obj[ns[0]] = _obj);
		}else{

			typeof(obj[name]) == 'object' ? $.extend(true, obj[name], data) : (obj[name] = data);
		}

		return obj;
	}

	fnData.prototype.getData = function(dom, rData) {

		return this.getObjData(dom, this.dataName, rData || {}, 1);
	};

	fnData.prototype.getObjData = function(dom, dataName, rData, nt) {
		var _self = this;

		var nextDataName = _self.dataName + '-' + nt;

		getDoms(dom, dataName).each(function(i, ele){
			var $ths = $(ele),
				name = $ths.attr(dataName),
				type = $ths.attr('data-type');

			var dv = null;

			if(type == 'object'){

				dv = _self.getObjData($ths, nextDataName, {}, nt+1);
			}else if(type == 'array'){

				dv = _self.getObjData($ths, nextDataName, [], nt+1);
			}else{

				dv = getVal($ths);
			}

			var isGE = _self.isGetEmpty || (typeof(dv) == 'object' ? !$.isEmptyObject(dv) : dv !== '');

			if(dv !== '#Not of value#' && isGE) setObjVal(rData, getFilter($ths, dv), name, _self.cut);
		});

		return rData;
	};

	function getToData(data, name, cut){
		var rd = null;

		if(name.indexOf(cut) > 0){
			var ns = name.split(cut);

			if(data[ns[0]] && data[ns[0]][ns[1]]) rd = data[ns[0]][ns[1]];
		}else{

			rd = data[name];
		}

		return rd;
	}

	function setVal($ele, v){
		var type = $ele.attr('type'),
			_filter = $ele.data('setfilter');

		$.isFunction(_filter) && (v = _filter($ele, v));

		if(fnIsIpt($ele)){

			if(type == 'radio'){
				$ele[0].checked = v == $ele.val();
			}else if(type == 'checkbox'){
				$ele[0].checked = v;
			}else{
				$ele.val(v);
			}
		}else{

			$ele.html(v);
		}
	}

	fnData.prototype.setData = function(dom, sData) {
		return this.setObjData(dom, this.dataName, sData, 1);
	};

	fnData.prototype.setObjData = function(dom, dataName, sData, nt) {
		var _self = this;

		var nextDataName = _self.dataName + '-' + nt;

		getDoms(dom, dataName).each(function(i, ele){
			var $ths = $(ele),
				name = $ths.attr(dataName),
				type = $ths.attr('data-type');

			var dv = getToData(sData, name, _self.cut);

			if(!dv) return true;

			if(type == 'object'){

				_self.setObjData($ths, nextDataName, dv, nt+1);
			}else if(type == 'array'){

				_self.setObjData($ths, nextDataName, dv, nt+1);
			}else{

				setVal($ths, dv);
			}
		});

		return _self;
	};

	return fnData;
}(window.jQuery))

var fnData = new FnData();