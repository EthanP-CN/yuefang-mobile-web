      
            <div class="content">
                <div class="yf-filter-item">
                    <div class="dl">
                        <div class="dt">价格区间</div>
                        <div class="dd">
                            <input type="text" id="priceRange" class="yf-touch-scroll" readonly="readonly" data-bind="value: parseInt(minPriceKo()).formatMoney(0, '¥', ',', '.') + ' 至 ' + parseInt(maxPriceKo()).formatMoney(0, '¥', ',', '.')" />
                        </div>
                        <i class="dl-arrow fa fa-chevron-right"></i>
                    </div>
                </div>
                <div class="yf-filter-item">
                    <div class="dl">
                        <div class="dt">房屋面积</div>
                        <div class="dd">
                            <input type="text" id="houseArea" class="yf-touch-scroll" readonly="readonly" data-bind="value: minHouseAreaKo() + ' 至 ' + maxHouseAreaKo()"/>
                        </div>
                        <i class="dl-arrow fa fa-chevron-right"></i>
                    </div>
                </div>
            
                <ul id="filter_list">
                    
<!--                     <li> -->
<!--                         <select id="minprice" class="yf-select"> -->
<!--                             <option value="" selected="selected">最小价格</option> -->
<!--                             <option value="0">0</option> -->
<!--                             <option value="50000">300,000</option> -->
<!--                             <option value="75000">400,000</option> -->
<!--                             <option value="100000">600,000</option> -->
<!--                             <option value="150000">900,000</option> -->
<!--                             <option value="200000">1,000,000</option> -->
<!--                             <option value="250000">1,500,000</option> -->
<!--                             <option value="300000">2,000,000</option> -->
<!--                             <option value="400000">2,500,000</option> -->
<!--                             <option value="500000">3,000,000</option>                           -->
<!--                         </select> -->
<!--                     </li> -->
<!--                     <li> -->
<!--                         <select id="maxprice"> -->
<!--                             <option value="">最大价格</option> -->
<!--                             <option value="100000">600,000</option> -->
<!--                             <option value="200000">1,200,000</option> -->
<!--                             <option value="300000">1,800,000</option> -->
<!--                             <option value="400000">2,500,000</option> -->
<!--                             <option value="500000">3,000,000</option> -->
<!--                             <option value="600000">3,500,000</option> -->
<!--                             <option value="700000">4,000,000</option> -->
<!--                             <option value="800000">5,000,000</option> -->
<!--                             <option value="900000">5,500,000</option> -->
<!--                             <option value="">任何价格</option>    -->
<!--                         </select> -->
<!--                     </li> -->
                    <li>
                        <span style="font-size: 13px;">洗手间</span>
                        <input type="hidden" id="minbaths" value="">
                        <div id="filter_restroom" class="roomNum">
                            <a id="minbaths0" href="javascript:void(0);" data-bind="click: setBath.bind($data, 0), attr: {class: minBathsKo() == 0 ? 'selected': ''}">不限</a>
                            <a id="minbaths1" href="javascript:void(0);" data-bind="click: setBath.bind($data, 1), attr: {class: minBathsKo() == 1 ? 'selected': ''}">1+</a>
                            <a id="minbaths2" href="javascript:void(0);" data-bind="click: setBath.bind($data, 2), attr: {class: minBathsKo() == 2 ? 'selected': ''}">2+</a>
                            <a id="minbaths3" href="javascript:void(0);" data-bind="click: setBath.bind($data, 3), attr: {class: minBathsKo() == 3 ? 'selected': ''}">3+</a>
                            <a id="minbaths4" href="javascript:void(0);" data-bind="click: setBath.bind($data, 4), attr: {class: minBathsKo() == 4 ? 'selected': ''}">4+</a>
                            <a id="minbaths5" href="javascript:void(0);" data-bind="click: setBath.bind($data, 5), attr: {class: minBathsKo() == 5 ? 'selected': ''}">5+</a>
                            <a id="minbaths6" href="javascript:void(0);" data-bind="click: setBath.bind($data, 6), attr: {class: minBathsKo() == 6 ? 'selected': ''}">6+</a>
                            <a id="minbaths7" href="javascript:void(0);" data-bind="click: setBath.bind($data, 7), attr: {class: minBathsKo() == 7 ? 'selected': ''}">7+</a>
                        </div>
                    </li>
                    <li>
                        <span style="font-size: 13px;">卧室</span>
                        <input type="hidden" id="minbeds" value="">
                        <div id="filter_bedroom" class="roomNum">
                            <a id="minbeds0" href="javascript:void(0);" data-bind="click: setBed.bind($data, 0), attr: {class: minBedsKo() == 0 ? 'selected': ''}">不限</a>
                            <a id="minbeds1" href="javascript:void(0);" data-bind="click: setBed.bind($data, 1), attr: {class: minBedsKo() == 1 ? 'selected': ''}">1+</a>
                            <a id="minbeds2" href="javascript:void(0);" data-bind="click: setBed.bind($data, 2), attr: {class: minBedsKo() == 2 ? 'selected': ''}">2+</a>
                            <a id="minbeds3" href="javascript:void(0);" data-bind="click: setBed.bind($data, 3), attr: {class: minBedsKo() == 3 ? 'selected': ''}">3+</a>
                            <a id="minbeds4" href="javascript:void(0);" data-bind="click: setBed.bind($data, 4), attr: {class: minBedsKo() == 4 ? 'selected': ''}">4+</a>
                            <a id="minbeds5" href="javascript:void(0);" data-bind="click: setBed.bind($data, 5), attr: {class: minBedsKo() == 5 ? 'selected': ''}">5+</a>
                            <a id="minbeds6" href="javascript:void(0);" data-bind="click: setBed.bind($data, 6), attr: {class: minBedsKo() == 6 ? 'selected': ''}">6+</a>
                            <a id="minbeds7" href="javascript:void(0);" data-bind="click: setBed.bind($data, 7), attr: {class: minBedsKo() == 7 ? 'selected': ''}">7+</a>
                        </div>
                    </li>

<!--                     <li> -->
<!--                         <span>正在看房</span><i class="rightArrow"></i> -->
<!--                     </li> -->
<!--                     <li> -->
<!--                         <select id="house_type"> -->
<!--                             <option value="">房屋类型</option> -->
<!--                             <option value="Residential">Residential -- 住宅</option> -->
<!--                             <option value="Multifamily">Multifamily -- 多栋</option> -->
<!--                             <option value="Condominium">Condominium -- 公寓</option> -->
<!--                             <option value="Commercial">Commercial -- 商业地产</option> -->
<!--                             <option value="Land">Land -- 地块</option> -->
<!--                             <option value="SingleFamilyHome">SingleFamilyHome -- 独栋</option> -->
<!--                             <option value="Townhouse">Townhouse -- 联排</option>     -->
<!--                         </select> -->
<!--                     </li> -->
<!--                     <li> -->
<!--                         <select id="minarea"> -->
<!--                             <option value="">房屋面积</option> -->

<!--                         </select> -->
<!--                     </li> -->
<!--                     <li> -->
<!--                         <select id="minyear"> -->
<!--                             <option value="">修建年份</option> -->
<!--                             <option value="2015">2015</option> -->
<!--                             <option value="2014">2014</option> -->
<!--                             <option value="2013">2013</option> -->
<!--                             <option value="2010">2010</option> -->
<!--                             <option value="2005">2005</option> -->
<!--                             <option value="2000">2000</option> -->
<!--                             <option value="1995">1995</option> -->
<!--                             <option value="1990">1990</option> -->
<!--                             <option value="1980">1980</option> -->
<!--                             <option value="1960">1960</option> -->
<!--                             <option value="1940">1940</option> -->
<!--                             <option value="1920">1920</option> -->
<!--                             <option value="1900">1900</option>     -->
<!--                         </select> -->
<!--                     </li> -->
<!--                     <li> -->
<!--                         <select id="maxdom"> -->
<!--                             <option value="0">发布时长</option> -->
<!--                             <option value="1">昨天</option> -->
<!--                             <option value="3">3天</option> -->
<!--                             <option value="7">7天</option> -->
<!--                             <option value="14">14天</option> -->
<!--                             <option value="30">30天</option> -->
<!--                             <option value="90">90天</option> -->
<!--                             <option value="180">6个月</option> -->
<!--                             <option value="360">12个月</option> -->
<!--                             <option value="720">24个月</option> -->
<!--                             <option value="900">36个月</option>                            -->
<!--                         </select> -->
<!--                     </li> -->
<!--                     <li> -->
<!--                         <select id="house_status"> -->
<!--                             <option value="">状态</option> -->
<!--                             <option value="Active">在售(Active)</option> -->
<!--                             <option value="Pending">交割中(Pending)</option> -->
<!--                             <option value="Closed">已售(Closed)</option> -->
<!--                         </select> -->
<!--                     </li> -->
                     </ul>
                <div class="yf-filter-item">
                    <div class="dl">
                        <div class="dt">房屋状态</div>
                        <div class="dd">
                            <input type="text" id="houseStatus" class="yf-touch-scroll" readonly="readonly" data-bind="value: houseStatusKo" />
                        </div>
                        <i class="dl-arrow fa fa-chevron-right"></i>
                    </div>
                </div>
                <div class="yf-filter-item">
                    <div class="dl">
                        <div class="dt">发布时间</div>
                        <div class="dd">
                            <input type="text" id="maxdom" class="yf-touch-scroll" readonly="readonly" data-bind="value: maxDomKo" />
                        </div>
                        <i class="dl-arrow fa fa-chevron-right"></i>
                    </div>
                </div>
                <div class="yf-filter-item">
                    <div class="dl">
                        <div class="dt">修建年份</div>
                        <div class="dd">
                            <input type="text" id="minyear" class="yf-touch-scroll" readonly="readonly" value="请选择" data-bind="value: minYearKo" />
                        </div>
                        <i class="dl-arrow fa fa-chevron-right"></i>
                    </div>
                </div>
                <div class="yf-filter-item">
                    <div class="dl">
                        <div class="dt">房屋类型</div>
                        <div class="dd">
                            <input type="text" id="houseType" class="yf-touch-scroll" readonly="readonly" data-bind="value: houseTypeKo" />
                        </div>
                        <i class="dl-arrow fa fa-chevron-right"></i>
                    </div>
                </div>
                
                <div class="yf-filter-bottom">
                    <button id="clearFilterBtn" class="btn btn-default">清除选项</button>
                </div>
                
                    <!-- <li>
                        <select>
                            <option value="">特色</option>
                            <option value="">易升值</option>
                            <option value="">学区房</option>
                            <option value="">海景房</option>
                            <option value="">农场房</option>
                        </select>
                    </li> -->
                    <!-- <li>
                        <span>华人生活指数</span>
                        <div id="filter_lifeindex" class="roomNum">
                            <a href="javascript:void(0);">不限</a>
                            <a href="javascript:void(0);">1+</a>
                            <a href="javascript:void(0);">2+</a>
                            <a href="javascript:void(0);">3+</a>
                            <a href="javascript:void(0);">4+</a>
                            <a href="javascript:void(0);">5+</a>
                            <a href="javascript:void(0);">6+</a>
                            <a href="javascript:void(0);">7+</a>
                        </div>
                    </li> -->
                    <!-- <li>
                        <span>学校</span>
                    </li> -->
               
            </div>
<!--         </div> -->
<script type="text/javascript">
$(function() {

// 	GET['minprice'] ? $('#minprice').val(GET['minprice']) : "";
// 	GET['maxprice'] ? $('#maxprice').val(GET['maxprice']) : "";
// 	GET['minarea'] ? $('#minarea').val(GET['minarea']) : "";
// 	GET['minyear'] ? $('#minyear').val(GET['minyear']) : "";
// 	GET['minbeds'] ? $('#minbeds'+GET['minbeds']).addClass('selected') : $('#minbeds0').addClass('selected');
// 	GET['minbaths'] ? $('#minbaths'+GET['minbaths']).addClass('selected') : $('#minbaths0').addClass('selected');
// 	GET['maxdom'] ? $('#maxdom').val(GET['maxdom']) : "";
// 	GET['type'] ? $('#house_type').val(GET['type']) : "";
// 	GET['status'] ? $('#house_status').val(GET['status']) : "";
});
</script>
