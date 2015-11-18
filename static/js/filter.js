/**
 * @author penghk
 * @date 2015.11.07
 * 
 */
(function(){
	$(function(){
		filterModel = {
			data: ko.observableArray([]).extend({ persist: 'Filter.data' }),
			minPriceKo: ko.observable('-').extend({ persist: 'Filter.minPriceKo' }),
			maxPriceKo: ko.observable('-').extend({ persist: 'Filter.maxPriceKo' }),
			minHouseAreaKo: ko.observable('-').extend({ persist: 'Filter.minHouseAreaKo' }),
			maxHouseAreaKo: ko.observable('-').extend({ persist: 'Filter.maxHouseAreaKo' }),
			minBathsKo: ko.observable('0').extend({ persist: 'Filter.minBathsKo' }),
			minBedsKo: ko.observable('0').extend({ persist: 'Filter.minBedsKo' }),
			houseStatusKo: ko.observable('请选择').extend({ persist: 'Filter.houseStatusKo' }),
			maxDomKo: ko.observable('请选择').extend({ persist: 'Filter.maxDomKo' }),
			houseTypeKo: ko.observable('请选择').extend({ persist: 'Filter.houseTypeKo' }),
			minYearKo: ko.observable('请选择').extend({ persist: 'Filter.minYearKo' }),
			setBath : function(val){
				this.minBathsKo(val);
				filterModel.saveFilterData('minbaths', val);
			},
			setBed : function(val){
				this.minBedsKo(val);
				filterModel.saveFilterData('minbeds', val);
			},
			saveFilterData : function(name, val){
				var _ = this,
				fdata = _.data(),
				isExists = _.isFilterDataExist(name);
				if(!isExists){
					_.insertFilterData(name, val);
				}else{
					_.updateFilterData(name, val);
				}
			},
			insertFilterData : function(name, val){
				this.data.push({name: name, val: val});
			},
			updateFilterData : function(name, val){
				var fdata = this.data();
				
				for(var i = 0; i < fdata.length; i++){
					if(fdata[i].name == name){
						this.data.splice(i, 1); //删除元素
						this.data.push({name: name, val: val});
					}
				}
			},
			isFilterDataExist : function(name){
				var fdata = this.data();
				if(!fdata) return false;
				for(var i = 0; i < fdata.length; i++){
					if(fdata[i].name == name){
						return true;
					}
				}
				return false;
			},
			getFilterData(){
				return this.data() ? ko.mapping.toJSON(this.data()) : null;
			}
		};
		
	    ko.applyBindings(filterModel, document.getElementById('filter_pop'));
		
		var filter = {
				data : {
					minPrice: 0, //区间起始价
					maxPrice: 0, //区间终止价
					minbeds: 0,  //卧室数量
					minbaths: 0, //洗手间数量
					house_type:'', //房屋类型
					minarea: 0, //房屋面积
					maxarea: 0,
					minyear: 0, //修建年份
					maxdom: 0, //发布时间
					house_status: '' //房屋状态
				},
				opts : {
					minPriceOpt: {
						 keys: ['0', '300000', '400000', '600000', '900000', '1000000', '1500000', '2000000', '2500000', '3000000'],
					     values: ['0', '300,000元', '400,000元', '600,000元', '900,000元', '1,000,000元', '1,500,000元', '2,000,000元', '2,500,000元', '3,000,000元']
					},
					maxPriceOpt: {
						keys: ['600000', '1200000', '1800000', '2500000', '3000000', '3500000', '4000000', '5000000', '5500000'],
			            values: ['600,000元', '1,200,000元', '1,800,000元', '2,500,000元', '3,000,000元', '3,500,000元', '4,000,000元', '5,000,000元', '5,500,000元']
					},
					houseTypeOpt: {
						keys: ['Residential', 'Multifamily', 'Condominium', 'Commercial', 'Land', 'SingleFamilyHome', 'Townhouse'],
						values: ['住宅', '多栋', '公寓', '商业地产', '地块', '独栋', '联排']
					},
					minhouseAreaOpt: {
						values: ['0', '50', '100', '150', '200', '250', '300', '400', '500', '1000']
					},
					maxhouseAreaOpt: {
						values: ['50', '100', '150', '200', '250', '300', '400', '500', '1000', '1000+']
					},
					minyearOpt: {
						values: ['2015', '2014', '2013', '2010', '2005', '2000', '1995', '1990', '1980', '1960', '1940', '1920', '1900']
					},
					houseStatusOpt: {
						keys: ['Active', 'Pending', 'Closed'],
						values: ['在售(Active)', '交割中(Pending)', '已售(Closed)']
					},
					maxdomOpt:{
						keys: ['1', '3', '7', '14', '30', '90', '180', '360', '720', '900'],
						values: ['昨天', '3天', '7天', '14天', '30天', '90天', '6个月', '12个月', '24个月', '36个月']
					}
				}
		}
		
		
		// 价格区间
		$('#priceRange').mobiscroll().scroller({
		    theme: 'mobiscroll',
		    display: 'bottom',
		    lang: 'zh',
		    wheels: [[ filter.opts.minPriceOpt, filter.opts.maxPriceOpt ]],
		    formatValue: function (data) {
		    	var startPrice = parseInt(data[0]);
		    	var endPrice = parseInt(data[1]);
		    	filter.data.minPrice = startPrice;
		    	filter.data.maxPrice = endPrice;
		    	return startPrice.formatMoney(0, '¥', ',', '.') + ' 至 ' + endPrice.formatMoney(0, '¥', ',', '.');
		    },
		    onSelect: function (text, inst){
		    	filterModel.minPriceKo(filter.data.minPrice);
		    	filterModel.maxPriceKo(filter.data.maxPrice);
		    	filterModel.saveFilterData('minprice', filter.data.minPrice);
		    	filterModel.saveFilterData('maxprice', filter.data.maxPrice);
		    }
		});
		
	    // 房屋类型
	    $('#houseType').mobiscroll().scroller({
		    theme: 'mobiscroll',
		    display: 'bottom',
		    lang: 'zh',
		    wheels: [[ filter.opts.houseTypeOpt ]],
		    formatValue: function(data){
		    	var houseType = data[0];
		    	filter.data.house_type = houseType;
		    	var selKey = filter.opts.houseTypeOpt.keys.indexOf(houseType);
		    	return filter.opts.houseTypeOpt.values[selKey];
		    },
		    onSelect: function(text, inst){
		    	filterModel.houseTypeKo(text);
		    	filterModel.saveFilterData('type', filter.data.house_type);
		    }
		});
	    
	    // 房屋面积
	    $('#houseArea').mobiscroll().scroller({
		    theme: 'mobiscroll',
		    display: 'bottom',
		    lang: 'zh',
		    wheels: [[ filter.opts.minhouseAreaOpt, filter.opts.maxhouseAreaOpt ]],
		    formatValue: function(data){
		    	var minArea = data[0];
		    	var maxArea = data[1];
		    	filter.data.minarea = minArea;
		    	filter.data.maxarea = maxArea;
		    	return minArea + ' 至 ' + maxArea; 
		    },
		    onSelect: function(text, inst){
		    	filterModel.minHouseAreaKo(filter.data.minarea);
		    	filterModel.maxHouseAreaKo(filter.data.maxarea);
		    	filterModel.saveFilterData('minarea', filter.data.minarea);
		    	filterModel.saveFilterData('maxarea', filter.data.maxarea);
		    }
	    });
	    
	    // 修建年份
	    $('#minyear').mobiscroll().scroller({
		    theme: 'mobiscroll',
		    display: 'bottom',
		    lang: 'zh',
		    wheels: [[ filter.opts.minyearOpt ]],
		    formatValue: function(data){
		    	var minyear = data[0];
		    	filter.data.minyear = minyear;
		    	return minyear;
		    },
		    onSelect: function(text, inst){
		    	filterModel.minYearKo(text);
		    	filterModel.saveFilterData('minyear', filter.data.minyear);
		    }
	    });
	    
	    // 发布时间
	    $('#maxdom').mobiscroll().scroller({
		    theme: 'mobiscroll',
		    display: 'bottom',
		    lang: 'zh',
		    wheels: [[ filter.opts.maxdomOpt ]],
		    formatValue: function(data){
		    	var maxdom = data[0];
		    	filter.data.maxdom = maxdom;
		    	
		    	var selKey = filter.opts.maxdomOpt.keys.indexOf(maxdom);
		    	return filter.opts.maxdomOpt.values[selKey];
		    },
		    onSelect: function(text, inst){
		    	filterModel.maxDomKo(text);
		    	filterModel.saveFilterData('maxdom', filter.data.maxdom);
		    }
	    });
	    
	    // 房屋状态
	    $('#houseStatus').mobiscroll().scroller({
		    theme: 'mobiscroll',
		    display: 'bottom',
		    lang: 'zh',
		    wheels: [[ filter.opts.houseStatusOpt ]],
		    formatValue: function(data){
		    	var houseStatus = data[0];
		    	filter.data.house_status = houseStatus;
		    	
		    	var selKey = filter.opts.houseStatusOpt.keys.indexOf(houseStatus);
		    	return filter.opts.houseStatusOpt.values[selKey];
		    },
		    onSelect: function(text, inst){
		    	filterModel.houseStatusKo(text);
		    	filterModel.saveFilterData('status', filter.data.house_status);
		    }
	    });
	    
	    // 清除选项
	    $("#clearFilterBtn").click(function () {
	    	filterModel.minPriceKo('-');
	    	filterModel.maxPriceKo('-');
	    	filterModel.minHouseAreaKo('-');
	    	filterModel.maxHouseAreaKo('-');
	    	filterModel.minBathsKo('0');
	    	filterModel.minBedsKo('0');
			filterModel.maxDomKo('请选择');
			filterModel.houseStatusKo('请选择');
			filterModel.houseTypeKo('请选择');
			filterModel.minYearKo('请选择');
	    });

	});
})();

