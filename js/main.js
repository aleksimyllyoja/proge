var gui, drawf;

var general_settings = {
  scale: 2.7,
  repeat_x: 1,
  repeat_y: 1,
  randomize: false,
  toggle_fullscreen: function() {
    if (screenfull.enabled) {
      screenfull.toggle();
    }
  },
  redraw: function() {
    draw()
  },
  download_json: download
};

function initialize() {
  if(gui) gui.destroy();

  gui = new dat.GUI();

  var gf = gui.addFolder('General');

  gf.add(general_settings, 'toggle_fullscreen');
  gf.add(general_settings, 'download_json');
  gf.add(general_settings, 'randomize').onChange(draw);
  gf.add(general_settings, 'scale', 1, 10).onChange(draw);
  gf.add(general_settings, 'redraw').onChange(draw);
  var rf = gui.addFolder('Repeater');

  rf.add(general_settings, 'repeat_x', 1, 10, 1).onChange(draw);
  rf.add(general_settings, 'repeat_y', 1, 10, 1).onChange(draw);

  rf.open();

  gf.open();
}

function download() {
    var data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(PATH));
    var a = document.createElement('a');
    a.setAttribute("href", data);
    a.setAttribute("download", "face_profile.json");

    document.body.appendChild(a);

    a.click();
    a.remove();
}

var MIN_POSTFIX = '__min';
var MAX_POSTFIX = '__max';
var RAND_POSTFIX = '__randomization';
var STEP_POSTFIX = '__step';
var FLOAT_POSTFIX = '__is_float';

function create_settings(settings, parent) {
  for(var k in Object.keys(settings)) {
    var property_name = Object.keys(settings)[k];
    if(!(property_name.endsWith(MAX_POSTFIX) ||
         property_name.endsWith(MIN_POSTFIX) ||
         property_name.endsWith(STEP_POSTFIX) ||
         property_name.endsWith(FLOAT_POSTFIX) ||
         property_name.endsWith(RAND_POSTFIX))) {

      parent.add(
        settings,
        property_name,
        settings[property_name+MIN_POSTFIX],
        settings[property_name+MAX_POSTFIX],
        settings[property_name+STEP_POSTFIX]
      ).onChange(draw);

      settings[property_name+RAND_POSTFIX] = {
        random_min: settings[property_name+MIN_POSTFIX],
        random_max: settings[property_name+MAX_POSTFIX],
        disable_random: false,
      }

      var property_randomization = parent.addFolder(property_name+" randomization");
      property_randomization.add(
        settings[property_name+RAND_POSTFIX],
        "disable_random"
      ).onChange(draw);

      property_randomization.add(
        settings[property_name+RAND_POSTFIX],
        "random_min",
        settings[property_name+MIN_POSTFIX],
        settings[property_name+MAX_POSTFIX],
        settings[property_name+STEP_POSTFIX]
      ).onChange(draw);

      property_randomization.add(
        settings[property_name+RAND_POSTFIX],
        "random_max",
        settings[property_name+MIN_POSTFIX],
        settings[property_name+MAX_POSTFIX],
        settings[property_name+STEP_POSTFIX]
      ).onChange(draw);
    }
  }
}

function run_randomization(settings) {
  for(var k in Object.keys(settings)) {
    var property_name = Object.keys(settings)[k];
    if(property_name.endsWith(RAND_POSTFIX)) {
      if(!settings[property_name].disable_random) {
        var property_value_name = property_name.replace(RAND_POSTFIX, '');

        if(settings.hasOwnProperty(property_value_name+FLOAT_POSTFIX)) {
          settings[property_value_name] = rand(
            settings[property_name].random_min,
            settings[property_name].random_max,
          )
        } else {
          settings[property_value_name] = rand_int(
            settings[property_name].random_min,
            settings[property_name].random_max,
          )
        }
      }
    }
  }

  gui.updateDisplay()
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function rand_int(min, max) {
  return Math.floor(rand(min, max));
}

function deg2rad(deg) {
  return deg*(Math.PI/180);
}

function face_profile() {
  var base_line_settings = {
    glabella: 0.15,
    glabella__min: 0.1,
    glabella__max: 0.3,
    glabella__step: 0.001,
    glabella__is_float: true,

    glabella_offset: 10,
    glabella_offset__min: 0,
    glabella_offset__max: 20,
    glabella_offset__step: 0.1,
    glabella_offset__is_float: true,

    sellion: 0.1,
    sellion__min: 0,
    sellion__max: 0.15,
    sellion__step: 0.001,
    sellion__is_float: true,

    sellion_offset: 80,
    sellion_offset__min: 0,
    sellion_offset__max: 100,
    sellion_offset__step: 0.001,
    sellion_offset__is_float: true,

    nasofrontal_angle: 157,
    nasofrontal_angle__min: 140,
    nasofrontal_angle__max: 160,
    nasofrontal_angle__step: 0.001,
    nasofrontal_angle__is_float: true,

    nasolabial_angle: 90,
    nasolabial_angle__min: 80,
    nasolabial_angle__max: 110,
    nasolabial_angle__step: 0.001,
    nasolabial_angle__is_float: true,

    subnasale: 0.6,
    subnasale__min: 0.5,
    subnasale__max: 0.8,
    subnasale__step: 0.001,
    subnasale__is_float: true,

    labial_point: 0.32,
    labial_point__min: 0.2,
    labial_point__max: 0.6,
    labial_point__step: 0.001,
    labial_point__is_float: true,

    labial_offset: 10,
    labial_offset__min: -10,
    labial_offset__max: 20,
    labial_offset__step: 0.001,
    labial_offset__is_float: true,

    pogonion_offset: 0,
    pogonion_offset__min: -10,
    pogonion_offset__max: 20,
    pogonion_offset__step: 0.001,
    pogonion_offset__is_float: true,
  }

  var nose_settings = {
    tip_frontal_control_point: 0.9,
    tip_frontal_control_point__min: 0.8,
    tip_frontal_control_point__max: 1,
    tip_frontal_control_point__step: 0.001,
    tip_frontal_control_point__is_float: true,

    tip_frontal_weight: 3,
    tip_frontal_weight__min: 1,
    tip_frontal_weight__max: 6,
    tip_frontal_weight__step: 1,

    tip_labial_control_point: 0.7,
    tip_labial_control_point__min: 0.5,
    tip_labial_control_point__max: 1,
    tip_labial_control_point__step: 0.001,
    tip_labial_control_point__is_float: true,

    tip_labial_weight: 1,
    tip_labial_weight__min: 1,
    tip_labial_weight__max: 6,
    tip_labial_weight__step: 1,

    rhinion_upper_control_point: 0.2,
    rhinion_upper_control_point__min: 0.1,
    rhinion_upper_control_point__max: 0.4,
    rhinion_upper_control_point__step: 0.001,
    rhinion_upper_control_point__is_float: true,

    rhinion_upper_offset: 1,
    rhinion_upper_offset__min: -10,
    rhinion_upper_offset__max: 4,
    rhinion_upper_offset__step: 0.1,
    rhinion_upper_offset__is_float: true,

    rhinion_upper_weight: 1,
    rhinion_upper_weight__min: 1,
    rhinion_upper_weight__max: 4,
    rhinion_upper_weight__step: 1,

    rhinion_lower_control_point: 0.5,
    rhinion_lower_control_point__min: 0.1,
    rhinion_lower_control_point__max: 1,
    rhinion_lower_control_point__step: 0.001,
    rhinion_lower_control_point__is_float: true,

    rhinion_lower_offset: -10,
    rhinion_lower_offset__min: -20,
    rhinion_lower_offset__max: 10,
    rhinion_lower_offset__step: 0.1,
    rhinion_lower_offset__is_float: true,

    rhinion_lower_weight: 1,
    rhinion_lower_weight__min: 1,
    rhinion_lower_weight__max: 4,
    rhinion_lower_weight__step: 1,
  }

  var forehead_settings = {
    smoothing_weight: 5,
    smoothing_weight__min: 2,
    smoothing_weight__max: 20,
    smoothing_weight__step: 0.1,
    smoothing_weight__is_float: true,

    glabella_weight: 1,
    glabella_weight__min: 1,
    glabella_weight__max: 3,
    glabella_weight__step: 1,
  }

  var labial_settings = {
    upper_lip_size: 0.2,
    upper_lip_size__min: 0.1,
    upper_lip_size__max: 0.3,
    upper_lip_size__step: 0.00001,
    upper_lip_size__is_float: true,

    upper_lip_depth: 5,
    upper_lip_depth__min: 4,
    upper_lip_depth__max: 12,
    upper_lip_depth__step: 0.00001,
    upper_lip_depth__is_float: true,

    upper_lip_smoothing: 0.19,
    upper_lip_smoothing__min: 0,
    upper_lip_smoothing__max: 3,
    upper_lip_smoothing__step: 0.1,
    upper_lip_smoothing__is_float: true,

    upper_lip_curve_offset: 0.5,
    upper_lip_curve_offset__min: 0.2,
    upper_lip_curve_offset__max: 0.9,
    upper_lip_curve_offset__step: 0.001,
    upper_lip_curve_offset__is_float: true,

    lower_lip_size: 0.15,
    lower_lip_size__min: 0.1,
    lower_lip_size__max: 0.3,
    lower_lip_size__step: 0.00001,
    lower_lip_size__is_float: true,

    lower_lip_depth: 5,
    lower_lip_depth__min: 4,
    lower_lip_depth__max: 7,
    lower_lip_depth__step: 0.00001,
    lower_lip_depth__is_float: true,

    lower_lip_curve_offset: 0.5,
    lower_lip_curve_offset__min: 0.2,
    lower_lip_curve_offset__max: 0.9,
    lower_lip_curve_offset__step: 0.001,
    lower_lip_curve_offset__is_float: true,

    curve_control_point: 0.8,
    curve_control_point__min: 0.3,
    curve_control_point__max: 1,
    curve_control_point__step: 0.001,
    curve_control_point__is_float: true,

    curve_depth: 7,
    curve_depth__min: 0.3,
    curve_depth__max: 9,
    curve_depth__step: 0.001,
    curve_depth__is_float: true,

    curve_weight: 2,
    curve_weight__min: 1,
    curve_weight__max: 5,
    curve_weight__step: 1,

    nose_smoothing: 5,
    nose_smoothing__min: 2,
    nose_smoothing__max: 20,
    nose_smoothing__step: 0.1,
    nose_smoothing__is_float: true,
  }

  var chin_settings = {
    chin_size: 0.5,
    chin_size__min: 0.3,
    chin_size__max: 0.8,
    chin_size__step: 0.00001,
    chin_size__is_float: true,

    upper_chin_curve_depth: 5,
    upper_chin_curve_depth__min: 3,
    upper_chin_curve_depth__max: 30,
    upper_chin_curve_depth__step: 0.00001,
    upper_chin_curve_depth__is_float: true,

    upper_chin_curve_offset: 0.5,
    upper_chin_curve_offset__min: 0.2,
    upper_chin_curve_offset__max: 0.9,
    upper_chin_curve_offset__step: 0.001,
    upper_chin_curve_offset__is_float: true,

    lower_chin_curve_depth: 5,
    lower_chin_curve_depth__min: 3,
    lower_chin_curve_depth__max: 30,
    lower_chin_curve_depth__step: 0.00001,
    lower_chin_curve_depth__is_float: true,

    lower_chin_curve_offset: 0.5,
    lower_chin_curve_offset__min: 0.2,
    lower_chin_curve_offset__max: 0.9,
    lower_chin_curve_offset__step: 0.001,
    lower_chin_curve_offset__is_float: true,

    jaw_curve_smoothing: 4,
    jaw_curve_smoothing__min: 2,
    jaw_curve_smoothing__max: 20,
    jaw_curve_smoothing__step: 0.00001,
    jaw_curve_smoothing__is_float: true,

    jaw_angle: 80,
    jaw_angle__min: 50,
    jaw_angle__max: 95,
    jaw_angle__step: 0.001,
    jaw_angle__is_float: true,
  }

  var mouth_settings = {
    mouth_depth: 20,
    mouth_depth__min: 10,
    mouth_depth__max: 60,
    mouth_depth__step: 0.001,
    mouth_depth__is_float: true,
  }

  var nostril_settings = {
    nostril_start: 0.0,
    nostril_start__min: 0.0,
    nostril_start__max: 0.35,
    nostril_start__step: 0.0001,
    nostril_start__is_float: true,

    nostril_start_bend: 2,
    nostril_start_bend__min: 1,
    nostril_start_bend__max: 5,
    nostril_start_bend__step: 1,

    nostril_start_bend_depth: 5,
    nostril_start_bend_depth__min: 1,
    nostril_start_bend_depth__max: 8,
    nostril_start_bend_depth__step: 1,
    nostril_start_bend_depth__is_float: true,

    nostril_start_bend_point: 0.2,
    nostril_start_bend_point__min: 0.1,
    nostril_start_bend_point__max: 0.4,
    nostril_start_bend_point__step: 0.0001,
    nostril_start_bend_point__is_float: true,

    nostril_end: 0.65,
    nostril_end__min: 0.5,
    nostril_end__max: 0.75,
    nostril_end__step: 0.0001,
    nostril_end__is_float: true,

    nostril_end_bend: 1,
    nostril_end_bend__min: 1,
    nostril_end_bend__max: 5,
    nostril_end_bend__step: 1,

    nostril_end_bend_depth: 5,
    nostril_end_bend_depth__min: 1,
    nostril_end_bend_depth__max: 8,
    nostril_end_bend_depth__step: 0.001,
    nostril_end_bend_depth__is_float: true,

    nostril_end_bend_point: 0.8,
    nostril_end_bend_point__min: 0.6,
    nostril_end_bend_point__max: 0.9,
    nostril_end_bend_point__step: 0.0001,
    nostril_end_bend_point__is_float: true,
  }

  var alar_crease_settings = {
    alar_crease_offset: 10,
    alar_crease_offset__min: 5,
    alar_crease_offset__max: 20,
    alar_crease_offset__step: 0.001,
    alar_crease_offset__is_float: true,

    alar_crease_angle: 80,
    alar_crease_angle__min: 65,
    alar_crease_angle__max: 100,
    alar_crease_angle__step: 0.001,
    alar_crease_angle__is_float: true,

    alar_crease_length: 15,
    alar_crease_length__min: 6,
    alar_crease_length__max: 20,
    alar_crease_length__step: 0.001,
    alar_crease_length__is_float: true,

    alar_crease_start_bend_point: 0.2,
    alar_crease_start_bend_point__min: 0.05,
    alar_crease_start_bend_point__max: 0.5,
    alar_crease_start_bend_point__step: 0.0001,
    alar_crease_start_bend_point__is_float: true,

    alar_crease_start_bend_depth: 8,
    alar_crease_start_bend_depth__min: 0,
    alar_crease_start_bend_depth__max: 10,
    alar_crease_start_bend_depth__step: 0.0001,
    alar_crease_start_bend_depth__is_float: true,

    alar_crease_start_bend_weight: 3,
    alar_crease_start_bend_weight__min: 1,
    alar_crease_start_bend_weight__max: 4,
    alar_crease_start_bend_weight__step: 1,

    alar_crease_end_bend_point: 0.8,
    alar_crease_end_bend_point__min: 0.6,
    alar_crease_end_bend_point__max: 0.9,
    alar_crease_end_bend_point__step: 0.0001,
    alar_crease_end_bend_point__is_float: true,

    alar_crease_end_bend_depth: 8,
    alar_crease_end_bend_depth__min: 0,
    alar_crease_end_bend_depth__max: 10,
    alar_crease_end_bend_depth__step: 0.0001,
    alar_crease_end_bend_depth__is_float: true,

    alar_crease_end_bend_weight: 1,
    alar_crease_end_bend_weight__min: 1,
    alar_crease_end_bend_weight__max: 2,
    alar_crease_end_bend_weight__step: 1,
  }

  var eye_settings = {
    eye_offset: 15,
    eye_offset__min: 10,
    eye_offset__max: 30,
    eye_offset__step: 0.001,
    eye_offset__is_float: true,

    eye_length: 35,
    eye_length__min: 20,
    eye_length__max: 45,
    eye_length__step: 0.001,
    eye_length__is_float: true,
  }

  var base_line_settings_folder = gui.addFolder("Base line");
  create_settings(base_line_settings, base_line_settings_folder);

  var nose_settings_folder = gui.addFolder("Nose");
  create_settings(nose_settings, nose_settings_folder);

  var eye_settings_folder = gui.addFolder("Eye");
  create_settings(eye_settings, eye_settings_folder);

  var nostril_settings_folder = gui.addFolder("Nostril");
  create_settings(nostril_settings, nostril_settings_folder);

  var alar_crease_settings_folder = gui.addFolder("Alar crease");
  create_settings(alar_crease_settings, alar_crease_settings_folder);

  var forehead_settings_folder = gui.addFolder("Forehead");
  create_settings(forehead_settings, forehead_settings_folder);

  var labial_settings_folder = gui.addFolder("Labial");
  create_settings(labial_settings, labial_settings_folder);

  var chin_settings_folder = gui.addFolder("Chin");
  create_settings(chin_settings, chin_settings_folder);

  var mouth_settings_folder = gui.addFolder("Mouth");
  create_settings(mouth_settings, mouth_settings_folder);

  return function() {
    if(general_settings.randomize) {
      run_randomization(base_line_settings);
      run_randomization(nose_settings);
      run_randomization(labial_settings);
      run_randomization(forehead_settings);
      run_randomization(chin_settings);
      run_randomization(mouth_settings);
      run_randomization(nostril_settings);
      run_randomization(alar_crease_settings);
      run_randomization(eye_settings);
    }

    // ================

    base_line_base = [
      [W/2+20, 10],
      [W/2+20, H-40]
    ]

    // ======== BASE LINE ========

    var glabella = split_at(
      base_line_base[0][0], base_line_base[0][1],
      base_line_base[1][0], base_line_base[1][1],
      base_line_settings.glabella
    );

    glabella[0] += base_line_settings.glabella_offset;

    var sellion = split_at(
      glabella[0], glabella[1],
      base_line_base[1][0]-base_line_settings.sellion_offset,
      base_line_base[1][1],
      base_line_settings.sellion
    );

    var sellion_line = [
      sellion[0]+Math.cos(deg2rad(base_line_settings.nasofrontal_angle-90))*60,
      sellion[1]+Math.sin(deg2rad(base_line_settings.nasofrontal_angle-90))*60
    ]

    var subnasale = split_at(
      base_line_base[0][0], base_line_base[0][1],
      base_line_base[1][0], base_line_base[1][1],
      base_line_settings.subnasale
    )

    var subnasale_line = [
      [subnasale[0], subnasale[1]],
      [
        subnasale[0]+Math.cos(deg2rad(-base_line_settings.nasolabial_angle-90))*60,
        subnasale[1]+Math.sin(deg2rad(-base_line_settings.nasolabial_angle-90))*60
      ]
    ];

    var nose_tip = intersection(
      [sellion, sellion_line],
      subnasale_line,
      true
    )

    var pogonion = base_line_base[1];
    pogonion[0]+=base_line_settings.pogonion_offset;

    var labial_point = split_at(
      subnasale[0], subnasale[1],
      pogonion[0], pogonion[1],
      base_line_settings.labial_point
    )

    labial_point[0] += base_line_settings.labial_offset;

    var base_line = [
      base_line_base[0],
      glabella,
      sellion,
      nose_tip,
      subnasale,
      labial_point,
      pogonion
    ]

    // ======== EYE ========

    var eye_front = [sellion[0], sellion[1]];
    eye_front[0] -= eye_settings.eye_offset;

    var eye_back = [eye_front[0], eye_front[1]];
    eye_back[0] -= eye_settings.eye_length;

    //mark(eye_front);
    //mark(eye_back);

    // ======== NOSE ========

    var tip_frontal_control_point = split_at(
      sellion[0], sellion[1],
      nose_tip[0], nose_tip[1],
      nose_settings.tip_frontal_control_point
    )

    var tip_labial_control_point = split_at(
      subnasale[0], subnasale[1],
      nose_tip[0], nose_tip[1],
      nose_settings.tip_labial_control_point
    )

    var _rhinion_upper_control_point = split_at(
      sellion[0], sellion[1],
      tip_frontal_control_point[0], tip_frontal_control_point[1],
      nose_settings.rhinion_upper_control_point
    )

    var rhinion_upper_control_point = [
      _rhinion_upper_control_point[0]+Math.cos(deg2rad(base_line_settings.nasofrontal_angle+180))*nose_settings.rhinion_upper_offset,
      _rhinion_upper_control_point[1]+Math.sin(deg2rad(base_line_settings.nasofrontal_angle+180))*nose_settings.rhinion_upper_offset
    ]

    var _rhinion_lower_control_point = split_at(
      _rhinion_upper_control_point[0], _rhinion_upper_control_point[1],
      tip_frontal_control_point[0], tip_frontal_control_point[1],
      nose_settings.rhinion_lower_control_point
    )

    var rhinion_lower_control_point = [
      _rhinion_lower_control_point[0]+Math.cos(deg2rad(base_line_settings.nasofrontal_angle+180))*nose_settings.rhinion_lower_offset,
      _rhinion_lower_control_point[1]+Math.sin(deg2rad(base_line_settings.nasofrontal_angle+180))*nose_settings.rhinion_lower_offset
    ]

    var nose_control_points = [
      sellion
    ].concat(
      Array(nose_settings.rhinion_upper_weight).fill(rhinion_upper_control_point)
    ).concat(
      Array(nose_settings.rhinion_lower_offset_weight).fill(rhinion_lower_control_point)
    ).concat(
      Array(nose_settings.tip_frontal_weight).fill(tip_frontal_control_point)
    ).concat(
      Array(nose_settings.tip_labial_weight).fill(tip_labial_control_point)
    ).concat([subnasale])

    var nose = bezier(nose_control_points, 100)

    // ======== NOSTRIL ========

    var _nostril_start = split_at(
      subnasale[0], subnasale[1],
      tip_labial_control_point[0], tip_labial_control_point[1],
      nostril_settings.nostril_start
    );

    var _nostril_end = split_at(
      subnasale[0], subnasale[1],
      tip_labial_control_point[0], tip_labial_control_point[1],
      nostril_settings.nostril_end
    );

    var nostril_start = [
      _nostril_start[0]+Math.cos(deg2rad(-base_line_settings.nasolabial_angle))*4,
      _nostril_start[1]+Math.sin(deg2rad(-base_line_settings.nasolabial_angle))*4
    ];

    var nostril_end = [
      _nostril_end[0]+Math.cos(deg2rad(-base_line_settings.nasolabial_angle))*4,
      _nostril_end[1]+Math.sin(deg2rad(-base_line_settings.nasolabial_angle))*4
    ];

    var _nostril_start_control_point = split_at(
      nostril_start[0], nostril_start[1],
      nostril_end[0], nostril_end[1],
      nostril_settings.nostril_start_bend_point
    );

    var nostril_start_control_point = [
      _nostril_start_control_point[0]+Math.cos(deg2rad(-base_line_settings.nasolabial_angle))*nostril_settings.nostril_start_bend_depth,
      _nostril_start_control_point[1]+Math.sin(deg2rad(-base_line_settings.nasolabial_angle))*nostril_settings.nostril_start_bend_depth
    ];

    var _nostril_end_control_point = split_at(
      nostril_start[0], nostril_start[1],
      nostril_end[0], nostril_end[1],
      nostril_settings.nostril_end_bend_point
    );

    var nostril_end_control_point = [
      _nostril_end_control_point[0]+Math.cos(deg2rad(-base_line_settings.nasolabial_angle))*nostril_settings.nostril_end_bend_depth,
      _nostril_end_control_point[1]+Math.sin(deg2rad(-base_line_settings.nasolabial_angle))*nostril_settings.nostril_end_bend_depth
    ];

    var nostril_control_points = [
      nostril_start
    ].concat(
      Array(nostril_settings.nostril_start_bend).fill(nostril_start_control_point)
    ).concat(
      Array(nostril_settings.nostril_end_bend).fill(nostril_end_control_point)
    ).concat([
      nostril_end
    ]);

    var nostril = bezier(nostril_control_points, 100)

    // ======== ALAR CREASE ========

    var alar_crease_start = [
      subnasale[0]+Math.cos(deg2rad(base_line_settings.nasolabial_angle+90))*alar_crease_settings.alar_crease_offset,
      subnasale[1]+Math.sin(deg2rad(base_line_settings.nasolabial_angle+90))*alar_crease_settings.alar_crease_offset
    ];

    var alar_crease_end = [
      alar_crease_start[0]+Math.cos(deg2rad(alar_crease_settings.alar_crease_angle+180))*alar_crease_settings.alar_crease_length,
      alar_crease_start[1]+Math.sin(deg2rad(alar_crease_settings.alar_crease_angle+180))*alar_crease_settings.alar_crease_length
    ];

    var _alar_crease_start_control_point = split_at(
      alar_crease_start[0], alar_crease_start[1],
      alar_crease_end[0], alar_crease_end[1],
      alar_crease_settings.alar_crease_start_bend_point
    );

    var _alar_crease_end_control_point = split_at(
      alar_crease_start[0], alar_crease_start[1],
      alar_crease_end[0], alar_crease_end[1],
      alar_crease_settings.alar_crease_end_bend_point
    );

    var alar_crease_end_control_point = [
      _alar_crease_end_control_point[0]+Math.cos(deg2rad(base_line_settings.nasolabial_angle+90))*alar_crease_settings.alar_crease_end_bend_depth,
      _alar_crease_end_control_point[1]+Math.sin(deg2rad(base_line_settings.nasolabial_angle+90))*alar_crease_settings.alar_crease_end_bend_depth
    ];

    var alar_crease_start_control_point = [
      _alar_crease_start_control_point[0]+Math.cos(deg2rad(base_line_settings.nasolabial_angle+90))*6,
      _alar_crease_start_control_point[1]+Math.sin(deg2rad(base_line_settings.nasolabial_angle+90))*6
    ];

    var alar_crease_control_points = [
      alar_crease_start
    ].concat(
      Array(alar_crease_settings.alar_crease_start_bend_weight).fill(alar_crease_start_control_point)
    ).concat(
      Array(alar_crease_settings.alar_crease_end_bend_weight).fill(alar_crease_end_control_point)
    ).concat([
      alar_crease_end
    ]);

    var alar_crease = bezier(alar_crease_control_points, 100);

    // ======== FOREHEAD ========

    var rhinion_angle = line_angle(
      rhinion_upper_control_point[0], rhinion_upper_control_point[1],
      sellion[0], sellion[1]
    )

    var forehead_smoothing_point = [
      sellion[0]+Math.cos(rhinion_angle)*forehead_settings.smoothing_weight,
      sellion[1]+Math.sin(rhinion_angle)*forehead_settings.smoothing_weight
    ]

    var forehead_control_points = [
      base_line[0]
    ].concat(
      Array(forehead_settings.glabella_weight).fill(glabella)
    ).concat([
      forehead_smoothing_point,
      sellion
    ]);

    var forehead = bezier(forehead_control_points, 100)

    // ======== LABIAL CURVES ========

    var _labial_curve_control_point = split_at(
      subnasale[0], subnasale[1],
      labial_point[0], labial_point[1],
      labial_settings.curve_control_point
    )

    var labial_angle = line_angle(
      subnasale[0], subnasale[1],
      labial_point[0], labial_point[1],
    )

    labial_curve_control_point = [
      _labial_curve_control_point[0]-Math.cos(labial_angle-Math.PI/2)*labial_settings.curve_depth,
      _labial_curve_control_point[1]-Math.sin(labial_angle-Math.PI/2)*labial_settings.curve_depth
    ]

    var labial_curve_nose_smoothing = [
      subnasale[0]+Math.cos(deg2rad(-base_line_settings.nasolabial_angle-90))*labial_settings.nose_smoothing,
      subnasale[1]+Math.sin(deg2rad(-base_line_settings.nasolabial_angle-90))*labial_settings.nose_smoothing
    ]

    var labial_curve_control_points = [
      subnasale,
      labial_curve_nose_smoothing
    ].concat(
      Array(labial_settings.curve_weight).fill(labial_curve_control_point)
    ).concat([
      labial_point
    ]);

    var labial_curve = bezier(labial_curve_control_points, 100)

    // ======== LIPS ========

    var lip_angle = line_angle(
      labial_point[0], labial_point[1],
      pogonion[0], pogonion[1]
    )

    var upper_lip_end = split_at(
      labial_point[0], labial_point[1],
      pogonion[0], pogonion[1],
      labial_settings.upper_lip_size,
    )

    var _upper_lip_curve_point = split_at(
      labial_point[0], labial_point[1],
      upper_lip_end[0], upper_lip_end[1],
      labial_settings.upper_lip_curve_offset
    )

    var upper_lip_curve_point = [
        _upper_lip_curve_point[0]+Math.cos(lip_angle-Math.PI/2)*labial_settings.upper_lip_depth,
        _upper_lip_curve_point[1]+Math.sin(lip_angle-Math.PI/2)*labial_settings.upper_lip_depth
    ]

    _labial_curve_tangent_angle = line_angle(
      labial_curve_control_point[0], labial_curve_control_point[1],
      labial_point[0], labial_point[1]
    )

    var upper_lip_smoothing_point = [
      labial_point[0]+Math.cos(_labial_curve_tangent_angle)*labial_settings.upper_lip_smoothing,
      labial_point[1]+Math.sin(_labial_curve_tangent_angle)*labial_settings.upper_lip_smoothing
    ]

    var upper_lip_smoothing = split_at(
      subnasale[0], subnasale[1],
      labial_point[0], labial_point[1],
      labial_settings.curve_control_point
    )

    var lower_lip_end = split_at(
      labial_point[0], labial_point[1],
      pogonion[0], pogonion[1],
      labial_settings.upper_lip_size+labial_settings.lower_lip_size,
    )

    var _lower_lip_curve_point = split_at(
      upper_lip_end[0], upper_lip_end[1],
      lower_lip_end[0], lower_lip_end[1],
      labial_settings.lower_lip_curve_offset
    )

    var lower_lip_curve_point = [
        _lower_lip_curve_point[0]+Math.cos(lip_angle-Math.PI/2)*labial_settings.lower_lip_depth,
        _lower_lip_curve_point[1]+Math.sin(lip_angle-Math.PI/2)*labial_settings.lower_lip_depth
    ]

    var upper_lip = bezier([
      labial_point,
      upper_lip_smoothing_point,
      upper_lip_curve_point,
      upper_lip_end
    ], 100)

    var lower_lip = bezier([
      upper_lip_end,
      lower_lip_curve_point,
      lower_lip_end
    ], 100)

    // ======== CHIN ========

    var chin_angle = line_angle(
      lower_lip_end[0], lower_lip_end[1],
      pogonion[0], pogonion[1]
    )

    var chin_curve_midpoint = split_at(
      lower_lip_end[0], lower_lip_end[1],
      pogonion[0], pogonion[1],
      chin_settings.chin_size,
    )

    var _chin_upper_curve_control_point = split_at(
      lower_lip_end[0], lower_lip_end[1],
      chin_curve_midpoint[0], chin_curve_midpoint[1],
      chin_settings.upper_chin_curve_offset
    )

    var chin_upper_curve_control_point = [
        _chin_upper_curve_control_point[0]-Math.cos(chin_angle-Math.PI/2)*chin_settings.upper_chin_curve_depth,
        _chin_upper_curve_control_point[1]-Math.sin(chin_angle-Math.PI/2)*chin_settings.upper_chin_curve_depth
    ]

    var _chin_lower_curve_control_point = split_at(
      chin_curve_midpoint[0], chin_curve_midpoint[1],
      pogonion[0], pogonion[1],
      chin_settings.lower_chin_curve_offset
    );

    var chin_lower_curve_control_point = [
        _chin_lower_curve_control_point[0]+Math.cos(chin_angle-Math.PI/2)*chin_settings.lower_chin_curve_depth,
        _chin_lower_curve_control_point[1]+Math.sin(chin_angle-Math.PI/2)*chin_settings.lower_chin_curve_depth
    ];

    var chin_curve = bezier([
      lower_lip_end,
      chin_upper_curve_control_point,
      chin_curve_midpoint,
      chin_lower_curve_control_point,
      pogonion
    ], 100);

    var chin_curve_tangent_angle = line_angle(
      chin_lower_curve_control_point[0], chin_lower_curve_control_point[1],
      pogonion[0], pogonion[1]
    );

    var jaw_curve_control_point = [
      pogonion[0]+Math.cos(chin_curve_tangent_angle)*chin_settings.jaw_curve_smoothing,
      pogonion[1]+Math.sin(chin_curve_tangent_angle)*chin_settings.jaw_curve_smoothing
    ];

    var jaw_end = [
      pogonion[0]+Math.cos(deg2rad(chin_settings.jaw_angle+90))*50,
      pogonion[1]+Math.sin(deg2rad(chin_settings.jaw_angle+90))*50
    ]

    var jaw_curve = bezier([
      pogonion,
      jaw_curve_control_point,
      jaw_end
    ], 100)

    // ======== MOUTH ========

    var mouth_end = [
      upper_lip_end[0]-mouth_settings.mouth_depth,
      upper_lip_end[1]
    ];

    var mouth = [
      upper_lip_end,
      mouth_end
    ]

    var upper_lip_profile = [
      labial_point,
      mouth_end
    ]

    var lower_lip_profile = [
      lower_lip_end,
      mouth_end
    ]

    return [
      alar_crease,
      mouth,
      nostril,
      upper_lip_profile,
      lower_lip_profile,
      chin_curve,
      jaw_curve,
      labial_curve,
      upper_lip,
      lower_lip,
      forehead,
      nose
    ];
  }
}

initialize();
drawf = face_profile();
draw();
