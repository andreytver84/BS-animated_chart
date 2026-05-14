<?php 
defined('_JEXEC') or die('Restricted access'); 
use Joomla\CMS\Language\Text;
?>

<div class="promo__slide-wrap bs-animated-chart-container">
    <div class="promo__slide-title">
        <?php echo htmlspecialchars($main_title, ENT_QUOTES, 'UTF-8'); ?>
        <?php if (!empty($sub_title)): ?>
            <span><?php echo htmlspecialchars($sub_title, ENT_QUOTES, 'UTF-8'); ?></span>
        <?php endif; ?>
    </div>
    
    <?php if (!empty($description)): ?>
        <div class="promo__slide-desc">
            <?php echo $description; // Описание уже отфильтровано как safehtml в XML ?>
        </div>
    <?php endif; ?>

    <div class="promo__statistics bs-statistics-module" id="bs-chart-<?php echo (int)$module->id; ?>">
        <div class="promo__statistics-numbers">
            
            <?php if (!empty($chart_data)): ?>
                <?php foreach ($chart_data as $item): 
                    // Строгая типизация для безопасности
                    $objects = (int) $item->objects;
                    $meters  = (int) $item->meters;
                    $year    = htmlspecialchars($item->year, ENT_QUOTES, 'UTF-8');
                ?>
                    <div class="promo__statistics-group">
                        <div class="promo__statistics-columns">
                            
                            <!-- Объекты -->
                            <div class="promo__statistics-column">
                                <div class="promo__statistics-value stat-num" data-count="<?php echo $objects; ?>">0</div>
                                <div class="promo__statistics-bar promo__statistics-bar--objects" data-val="<?php echo $objects; ?>"></div>
                                <div class="promo__statistics-label"><?php echo Text::_('MOD_BS_ANIMATED_CHART_FRONT_OBJECTS'); ?></div>
                            </div>
                            
                            <!-- Метры -->
                            <div class="promo__statistics-column">
                                <div class="promo__statistics-area stat-num stat-meters" data-count="<?php echo $meters; ?>">0 <?php echo Text::_('MOD_BS_ANIMATED_CHART_FRONT_M2'); ?></div>
                                <div class="promo__statistics-bar promo__statistics-bar--meters" data-val="<?php echo $meters; ?>"></div>
                                <div class="promo__statistics-label"><?php echo Text::_('MOD_BS_ANIMATED_CHART_FRONT_METERS'); ?></div>
                            </div>

                        </div>
                        <div class="promo__statistics-year"><?php echo $year; ?></div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>

        </div>
        <div class="promo__statistics-underline active"></div>
    </div>
</div>