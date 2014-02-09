<?php
/**
 * 
 */
class Form
{
    public static function createObject($json = null)
    {
        $item = new stdClass();
        if ($json)
        {
            $json = json_decode($json, true);
            foreach ($json['elements'] as $element)
            {
                $name = $element['name'];
                $item->$name = array();
                $array = array();
                foreach ($element as $index => $value)
                {
                    if ($index != 'name')
                        $array[$index] = $value;
                }
                $item->$name = $array;
            }
            return ($item);
        }
    }

    public static function escape($datas = null)
    {
        $return = array();
        if (!is_null($datas))
        {
            foreach ($datas as $key => $data)
                $return[$key] = is_string($data) ? htmlspecialchars($data, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8', false) : $data;
        }
        return ($return);
    }
    
    public static function generatePassword($password)
    {
        return (hash('sha512', hash('sha512', $password) . PASSWORD_SALT));
    }

    public static function inputText($item = null, $name = null, $value = null)
    {
        $object = $item->$name;

        $value = (is_null($value)) ? '' : "value='{$value}'";
        $placeholder = ($object['placeholder']) ? 'placeholder="' . $object['placeholder'] . '"' : '';

        $input = '<input type="' . $object['type'] . '" name="' . $name . '" id="' . $name . '" class="form-control" ' . $placeholder . ' ' . $value . '/>';;
        return ($input);
    }

    public static function inputSelect($item = null, $name = null, $value = null)
    {
        $object = $item->$name;

        //$object['value'] = (is_null($value)) ? $object['value'] : $value;
        $select = '<select class="form-control" name="' . $name . '" id="' . $name . '">';
        foreach ($object['options'] as $option)
            $select .= '<option value="' . $option['value'] . '">' . $option['value'] . '</option>';
        $select .= '</select>';
        return ($select);
    }

    public static function isEmpty($post)
    {
        foreach ($post as $key => $value)
        {
            if (!isset($post[$key]) or empty($value))
                return (true);
        }
        return (false);
    }
}

?>
