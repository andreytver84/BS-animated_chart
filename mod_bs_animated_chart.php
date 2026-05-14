<?php
defined('_JEXEC') or die('Restricted access'); // Защита от прямого обращения к файлу

use Joomla\CMS\Helper\ModuleHelper;
use Joomla\CMS\Factory;

// Получаем параметры
$main_title  = $params->get('main_title', '');
$sub_title   = $params->get('sub_title', '');
$description = $params->get('description', '');
$chart_data  = $params->get('chart_data', []);
$color_objects = $params->get('color_objects', '#004E82');
$color_meters  = $params->get('color_meters', '#004E82');
$objects_coef       = (int) $params->get('objects_coef', 10);
$anim_delay         = (int) $params->get('anim_delay', 0);
$anim_speed_objects = (int) $params->get('anim_speed_objects', 1500);
$anim_speed_meters  = (int) $params->get('anim_speed_meters', 1500);

// Подключение CSS и JS через WebAssetManager (Стандарт Joomla 5)
$wa = Factory::getApplication()->getDocument()->getWebAssetManager();

// Регистрируем и подключаем стили и скрипты
$wa->registerAndUseStyle('mod_bs_animated_chart_css', 'modules/mod_bs_animated_chart/assets/css/style.css');
$wa->registerAndUseScript('mod_bs_animated_chart_js', 'modules/mod_bs_animated_chart/assets/js/script.js', [], ['defer' => true]);

require ModuleHelper::getLayoutPath('mod_bs_animated_chart', $params->get('layout', 'default'));