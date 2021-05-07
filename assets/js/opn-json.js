!(function () {
  "use strict";

  let opn_context = [];
  let opn_types_array = [];
  let sid, name, optout, policy, provider, providerUrl, types, typesJa, typeJa, type_flag, url, type, _types_key, handle_types_array, _type_text, _use_data;
  const OPN_SOURCE_FILE = 'https://as.datasign.co/privacy/policy/3c92c535-opn.json'

  $.when(
      $.getJSON(OPN_SOURCE_FILE)
    )
    .done(function (resp_opn) {
      if (!Object.entries) {
        Object.entries = function (obj) {
          let ownProps = Object.keys(obj),
            i = ownProps.length,
            resArray = new Array(i);
          while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];

          return resArray;
        };
      };

      let opn_sources = resp_opn;
      opn_sources = Object.entries(opn_sources);
      console.log(opn_sources)

      createOpnObject(opn_sources);
      createTypesArray();

      const _opn_node = $('#online-privacy-notice');
      CreateOpnNodeWrapper();
      for (let i = 0; i < opn_types_array.length; i++) {
        _types_key = opn_types_array[i];
        switch (findTypes(opn_context, _types_key)) {
          case 'ad':
          case 'an':
          case 'da':
          case 'so':
            _use_data = 'use';
            break;
          default:
            _use_data = 'not_use';
            break;
        }
        let _opn_node_parent = $('#' + _use_data);
        CreateTableElement(_opn_node_parent);
      };

      for (let i = 0; i < opn_context.length; i++) {
        let _opn_item = opn_context[i];
        let _type_flag = _opn_item.type_flag;
        $('<div>', {
          id: _type_flag + _opn_item.id,
          class: '_opn_node'
        }).appendTo($('div.' + _type_flag)[0]);
        if (SmCheck()) {
          $('<div>', {
            class: '_opn_node_inner_wrap name'
          }).appendTo($('div#' + _type_flag + _opn_item.id)[0]);
          $('<div>', {
            class: '_opn_node_inner_wrap provider'
          }).appendTo($('div#' + _type_flag + _opn_item.id)[0]);
          $('<div>', {
            class: '_opn_node_inner_wrap policy'
          }).appendTo($('div#' + _type_flag + _opn_item.id)[0]);
          $('<div>', {
            class: '_opn_node_inner_wrap optout'
          }).appendTo($('div#' + _type_flag + _opn_item.id)[0]);
        }
        $('<a>', {
          class: '_opn_node_items name',
          href: _opn_item.url,
          target: '_blank',
          text: _opn_item.name
        }).appendTo(SmCheck() ? $('div#' + _type_flag + _opn_item.id + ' ._opn_node_inner_wrap.name') : $('div#' + _type_flag + _opn_item.id))
        $('<a>', {
          class: '_opn_node_items provider',
          href: _opn_item.providerUrl,
          target: '_blank',
          text: _opn_item.provider
        }).appendTo(SmCheck() ? $('div#' + _type_flag + _opn_item.id + ' ._opn_node_inner_wrap.provider') : $('div#' + _type_flag + _opn_item.id))

        $('<a>', {
          class: '_opn_node_items policy',
          href: _opn_item.policy,
          target: '_blank',
          text: 'プライバシーポリシー'
        }).appendTo(SmCheck() ? $('div#' + _type_flag + _opn_item.id + ' ._opn_node_inner_wrap.policy') : $('div#' + _type_flag + _opn_item.id))
        $('<a>', {
          class: '_opn_node_items optout',
          href: _opn_item.optout,
          target: '_blank',
          text: 'オプトアウト'
        }).appendTo(SmCheck() ? $('div#' + _type_flag + _opn_item.id + ' ._opn_node_inner_wrap.optout') : $('div#' + _type_flag + _opn_item.id))
      };

      if (SmCheck()) {
        $('<span>', {
          class: '_opn_node_thead',
          text: 'サービス名'
        }).insertBefore($('a._opn_node_items.name'));

        $('<span>', {
          class: '_opn_node_thead',
          text: 'サービス提供元'
        }).insertBefore($('a._opn_node_items.provider'));

        $('<span>', {
          class: '_opn_node_thead',
          text: 'プライバシーポリシー'
        }).insertBefore($('a._opn_node_items.policy'));

        $('<span>', {
          class: '_opn_node_thead',
          text: 'オプトアウト'
        }).insertBefore($('a._opn_node_items.optout'));
      }

      function createOpnObject(opn_sources) {
        for (let i = 0; i < opn_sources.length; i++) {
          sid = readOpn(opn_sources[i], 'sid');
          name = readOpn(opn_sources[i], 'nameJa');
          optout = readOpn(opn_sources[i], 'optoutUrl');
          policy = readOpn(opn_sources[i], 'policyUrl');
          provider = readOpn(opn_sources[i], 'provider');
          providerUrl = readOpn(opn_sources[i], 'providerUrl');
          types = readOpn(opn_sources[i], 'types');
          typesJa = readOpn(opn_sources[i], 'typesJa');
          url = readOpn(opn_sources[i], 'url');

          type = types[0];
          typeJa = typesJa[0];
          type_flag = type !== undefined ? type.toLowerCase().substr(0, 2) : 'in';

          if (name !== undefined) { // && type_flag == 'ad' || type_flag == 'an' || type_flag == 'da') {
            opn_context.push({
              id: sid,
              name: name,
              optout: optout,
              policy: policy,
              provider: provider,
              providerUrl: providerUrl,
              type_flag: type_flag,
              type: typeJa,
              url: url
            });
          };
        };
        opn_context.sort(sortObjByValue);
      };

      function sortObjByValue(a, b) {
        let nameA = a.name.toUpperCase();
        let nameB = b.name.toUpperCase();

        let comparison = 0;
        if (nameA > nameB) {
          comparison = 1;
        } else if (nameA < nameB) {
          comparison = -1;
        };
        return comparison;
      };

      function createTypesArray() {
        for (let k = 0; k < opn_context.length; k++) {
          opn_types_array.push(opn_context[k].type_flag)
        };
        opn_types_array = ArrayToUniq(opn_types_array).sort();
      };

      function readOpn(obj, key) {
        for (let prop in obj) {
          if (key == 'sid') {
            return obj[0];
          } else if (key == 'types' || key == 'typesJa' || key == 'name' || key == 'nameJa') {
            return obj[1][key];
          } else {
            let pin = key + 'Ja';
            if (obj[1][pin] != undefined) {
              return obj[1][pin];
            } else {
              return obj[1][key];
            }
          };
        };
      };

      function findTypes(obj, key) {
        for (let prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            if (obj[prop].type_flag === key)
              return obj[prop].type_flag;
          };
        };
      };

      function CreateOpnNodeWrapper() {
        _type_text = {
          'use': 'パーソナルデータを利用している外部サービス',
          'not_use': 'パーソナルデータを利用していない外部サービス'
        }
        for (let key in _type_text) {
          $('<div>', {
            id: key,
            class: '_opn_node_wrapper' + ' ' + key,
          }).appendTo(_opn_node);
          let _opn_node_parent = $('#' + key);
          $('<span>', {
            class: '_opn_node_header',
            text: _type_text[key]
          }).appendTo(_opn_node_parent);
        }
      }

      function CreateTableElement(_opn_node_parent) {
        $('<div>', {
          class: _types_key + ' ' + '_opn_node_inner',
        }).appendTo(_opn_node_parent);

        let opn_node_title = $('<div>', {
          id: _types_key,
          class: '_opn_node_title'
        })
        $('.' + _types_key + '._opn_node_inner').before(opn_node_title);
        const types_name_dict = {
          ad: "広告",
          an: "アクセス解析",
          da: "データ収集",
          in: "インタラクション",
          ta: "タグマネージャー",
          we: "ウェブツール"
        }
        let type_name = $('<p>', {
          class: '_opn_type_name',
          text: types_name_dict[_types_key]
        })
        $(opn_node_title).before(type_name);

        if (!SmCheck()) {
          $('<span>', {
            class: '_opn_node_items name',
            text: 'サービス名'
          }).appendTo($('#' + _types_key));

          $('<span>', {
            class: '_opn_node_items',
            text: 'サービス提供元'
          }).appendTo($('#' + _types_key));

          $('<span>', {
            class: '_opn_node_items',
            text: 'プライバシーポリシー'
          }).appendTo($('#' + _types_key));

          $('<span>', {
            class: '_opn_node_items',
            text: 'オプトアウト'
          }).appendTo($('#' + _types_key));
        }
      }

      function SmCheck() {
        if ($(window).width() <= 600) {
          return true;
        } else {
          return false;
        }
      }

      function ArrayToUniq(array) {
        var knownElements = {};
        var unique_Array = [];
        for (let i = 0, maxi = array.length; i < maxi; i++) {
          if (array[i] in knownElements) continue;
          unique_Array.push(array[i]);
          knownElements[array[i]] = true;
        };
        return unique_Array;
      };

      $("a._opn_node_items").each(function () {
        if (this.href.indexOf(location.host) >= 0) {
          $(this).addClass('no_href');
          $(this).click(function () {
            return false;
          });
        };
      });
    }).fail(function () {
      console.log("JSON Handling Error.");
    })
}).call(this);