<script id="list-item-template" type="text/x-handlebars-template">
{{#each this}}
<li class="favoriItem">
	<i class="fa fa-image list-item-default-img"></i>
	<a href="./view.php?id={{mlsId}}">
		<img class="lazy" width="320" height="180" src="{{photos.[0]}}">
		<div class="itemIntro">
			<div class="itemWrapper">
				<table>
					<tbody>
						<tr>
							<td class="introPrice">约{{formatMoney listPrice}}(人民币)</td>
							<td>房  型：{{property.bedrooms}}卧 {{formatBaths property.bathrooms}}卫</td>
						</tr>
						<tr>
							<td>建筑面积：{{formatArea property.area}}㎡</td>
							<td>土地面积：{{formatArea property.lotSize}}㎡</td>
						</tr>
						<tr>
							<td colspan="2">地  址：{{address.full}}&nbsp;{{address.city}}&nbsp;{{address.state}}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="itemIcon">
				<i class="btnFavori {{ifFav fav}}" idata="{{mlsId}}" odata=""></i>
			</div>
		</div>
	</a>
</li>
{{/each}}
</script>
