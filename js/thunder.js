/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [Kaven-Common] /JavaScript/Thunder.js
 * @create:      2021-02-15 23:27:42.349
 * @modify:      2021-02-15 23:27:42.349
 * @version:     
 * @times:       1
 * @lines:       1
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

$(".current-tab .down_part_name a").map(function(){ return $(this).attr("href")}).get().join('\n')